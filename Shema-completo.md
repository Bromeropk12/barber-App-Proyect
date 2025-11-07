
---

## 📊 **SCHEMA 1: AUTENTICACIÓN Y USUARIOS**

**Archivo: `supabase-schema-1-auth.sql`**

```sql
-- ===========================================
-- SCHEMA 1: AUTENTICACIÓN Y USUARIOS
-- ===========================================

-- Extensión para UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabla de perfiles de usuario (extiende auth.users)
CREATE TABLE public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    phone TEXT UNIQUE,
    role TEXT NOT NULL CHECK (role IN ('cliente', 'barbero', 'super_admin')),
    avatar_url TEXT,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,

    -- Campos específicos por rol
    experience_years INTEGER CHECK (experience_years >= 0), -- Solo para barberos
    work_shift TEXT CHECK (work_shift IN ('morning', 'afternoon', 'full')), -- Solo para barberos
    barber_status TEXT DEFAULT 'available' CHECK (barber_status IN ('available', 'break', 'vacation', 'inactive')) -- Solo para barberos
);

-- Función para actualizar updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para updated_at en profiles
CREATE TRIGGER handle_updated_at_profiles
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Políticas RLS (Row Level Security)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Política: Los usuarios pueden ver su propio perfil
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

-- Política: Los usuarios pueden actualizar su propio perfil
CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- Política: Super admins pueden ver todos los perfiles
CREATE POLICY "Super admins can view all profiles" ON public.profiles
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'super_admin'
        )
    );

-- Política: Super admins pueden actualizar cualquier perfil
CREATE POLICY "Super admins can update all profiles" ON public.profiles
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'super_admin'
        )
    );

-- Función para crear perfil automáticamente al registrarse
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    user_role TEXT := 'cliente'; -- Default role
BEGIN
    -- Determinar rol basado en metadata o contraseña especial
    IF NEW.raw_user_meta_data->>'admin_password' = 'soloadmins123' THEN
        user_role := 'super_admin';
    ELSIF NEW.raw_user_meta_data->>'barber_password' = 'solobarbers123' THEN
        user_role := 'barbero';
    END IF;

    INSERT INTO public.profiles (id, email, full_name, phone, role)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
        NEW.raw_user_meta_data->>'phone',
        user_role
    );

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para crear perfil automáticamente
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Índices para optimización
CREATE INDEX idx_profiles_email ON public.profiles(email);
CREATE INDEX idx_profiles_role ON public.profiles(role);
CREATE INDEX idx_profiles_phone ON public.profiles(phone);
```

---

## 🛍️ **SCHEMA 2: SERVICIOS Y CATÁLOGOS**

**Archivo: `supabase-schema-2-services.sql`**

```sql
-- ===========================================
-- SCHEMA 2: SERVICIOS Y CATÁLOGOS
-- ===========================================

-- Tabla de servicios disponibles
CREATE TABLE public.services (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    duration_minutes INTEGER NOT NULL CHECK (duration_minutes > 0),
    base_price DECIMAL(10,2) NOT NULL CHECK (base_price >= 0),
    category TEXT NOT NULL, -- 'haircut', 'shaving', 'beard', 'combo'
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Tabla de precios personalizados por barbero
CREATE TABLE public.barber_service_prices (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    barber_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    service_id UUID REFERENCES public.services(id) ON DELETE CASCADE,
    custom_price DECIMAL(10,2) CHECK (custom_price >= 0),
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,

    UNIQUE(barber_id, service_id)
);

-- Tabla de horarios de barbería
CREATE TABLE public.business_hours (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6), -- 0=Domingo, 6=Sábado
    open_time TIME NOT NULL,
    close_time TIME NOT NULL,
    is_closed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,

    CHECK (close_time > open_time OR is_closed = TRUE),
    UNIQUE(day_of_week)
);

-- Insertar horarios por defecto (Lunes a Domingo)
INSERT INTO public.business_hours (day_of_week, open_time, close_time, is_closed) VALUES
(1, '10:00', '20:00', FALSE), -- Lunes
(2, '10:00', '20:00', FALSE), -- Martes
(3, '10:00', '20:00', FALSE), -- Miércoles
(4, '10:00', '20:00', FALSE), -- Jueves
(5, '10:00', '21:00', FALSE), -- Viernes
(6, '10:00', '21:00', FALSE), -- Sábado
(0, '10:00', '18:00', FALSE); -- Domingo

-- Políticas RLS para servicios
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.barber_service_prices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_hours ENABLE ROW LEVEL SECURITY;

-- Servicios: Todos pueden ver servicios activos
CREATE POLICY "Anyone can view active services" ON public.services
    FOR SELECT USING (is_active = TRUE);

-- Servicios: Solo super admins pueden modificar
CREATE POLICY "Super admins can manage services" ON public.services
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'super_admin'
        )
    );

-- Precios de barberos: Barberos pueden ver/modificar sus propios precios
CREATE POLICY "Barbers can manage their service prices" ON public.barber_service_prices
    FOR ALL USING (barber_id = auth.uid());

-- Precios de barberos: Clientes pueden ver precios disponibles
CREATE POLICY "Clients can view barber service prices" ON public.barber_service_prices
    FOR SELECT USING (is_available = TRUE);

-- Horarios: Todos pueden ver
CREATE POLICY "Anyone can view business hours" ON public.business_hours
    FOR SELECT USING (TRUE);

-- Horarios: Solo super admins pueden modificar
CREATE POLICY "Super admins can manage business hours" ON public.business_hours
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'super_admin'
        )
    );

-- Triggers para updated_at
CREATE TRIGGER handle_updated_at_services
    BEFORE UPDATE ON public.services
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_updated_at_business_hours
    BEFORE UPDATE ON public.business_hours
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Índices
CREATE INDEX idx_services_category ON public.services(category);
CREATE INDEX idx_services_active ON public.services(is_active);
CREATE INDEX idx_barber_service_prices_barber ON public.barber_service_prices(barber_id);
CREATE INDEX idx_business_hours_day ON public.business_hours(day_of_week);

-- Insertar servicios por defecto
INSERT INTO public.services (name, description, duration_minutes, base_price, category) VALUES
('CORTES DE CABALLERO', 'Todas las formas y estilos posibles pueden hacerse realidad gracias a las técnicas avanzadas de estilismo.', 45, 35.00, 'haircut'),
('AFEITADO CLÁSICO', 'Un look limpio y prolijo es garantía de éxito en todo lo que hagas.', 20, 15.00, 'shaving'),
('ARREGLO DE BARBA', 'Encontrar la forma perfecta para tu vello facial puede ser complicado.', 25, 20.00, 'beard'),
('AFEITADO CON TOALLA CALIENTE', 'El vapor te envolverá en comodidad mientras relaja y limpia los poros.', 40, 35.00, 'shaving'),
('RECORTE DE BARBA', 'Nuestros especialistas saben lo que está en tendencia.', 20, 20.00, 'beard'),
('CORTES CON MÁQUINA', 'Lo simple también puede ser elegante.', 30, 20.00, 'haircut');
```

---

## 📅 **SCHEMA 3: RESERVAS Y HORARIOS**

**Archivo: `supabase-schema-3-reservations.sql`**

```sql
-- ===========================================
-- SCHEMA 3: RESERVAS Y HORARIOS
-- ===========================================

-- Tabla de disponibilidad de barberos
CREATE TABLE public.barber_availability (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    barber_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    is_available BOOLEAN DEFAULT TRUE,
    reason TEXT, -- 'break', 'vacation', 'personal', etc.
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,

    CHECK (end_time > start_time),
    UNIQUE(barber_id, date, start_time)
);

-- Tabla de reservas
CREATE TABLE public.reservations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    client_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    barber_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    service_id UUID REFERENCES public.services(id) ON DELETE CASCADE,
    reservation_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled', 'no_show')),
    total_price DECIMAL(10,2) NOT NULL CHECK (total_price >= 0),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,

    CHECK (end_time > start_time),
    CHECK (reservation_date >= CURRENT_DATE)
);

-- Tabla de pagos simulados
CREATE TABLE public.payments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    reservation_id UUID REFERENCES public.reservations(id) ON DELETE CASCADE,
    payment_method TEXT NOT NULL CHECK (payment_method IN ('cash', 'card')),
    amount DECIMAL(10,2) NOT NULL CHECK (amount >= 0),
    status TEXT DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
    transaction_id TEXT UNIQUE, -- Simulado para tarjetas
    payment_date TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,

    UNIQUE(reservation_id)
);

-- Políticas RLS
ALTER TABLE public.barber_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Disponibilidad: Barberos pueden gestionar su disponibilidad
CREATE POLICY "Barbers can manage their availability" ON public.barber_availability
    FOR ALL USING (barber_id = auth.uid());

-- Disponibilidad: Todos pueden ver disponibilidad disponible
CREATE POLICY "Anyone can view available slots" ON public.barber_availability
    FOR SELECT USING (is_available = TRUE);

-- Reservas: Clientes pueden ver/modificar sus propias reservas
CREATE POLICY "Clients can manage their reservations" ON public.reservations
    FOR ALL USING (client_id = auth.uid());

-- Reservas: Barberos pueden ver reservas asignadas
CREATE POLICY "Barbers can view their assigned reservations" ON public.reservations
    FOR SELECT USING (barber_id = auth.uid());

-- Reservas: Super admins pueden ver todas
CREATE POLICY "Super admins can view all reservations" ON public.reservations
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'super_admin'
        )
    );

-- Pagos: Solo el cliente puede ver sus pagos
CREATE POLICY "Clients can view their payments" ON public.payments
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.reservations
            WHERE id = reservation_id AND client_id = auth.uid()
        )
    );

-- Triggers
CREATE TRIGGER handle_updated_at_barber_availability
    BEFORE UPDATE ON public.barber_availability
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_updated_at_reservations
    BEFORE UPDATE ON public.reservations
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Función para calcular end_time automáticamente
CREATE OR REPLACE FUNCTION public.calculate_reservation_end_time()
RETURNS TRIGGER AS $$
DECLARE
    service_duration INTEGER;
BEGIN
    SELECT duration_minutes INTO service_duration
    FROM public.services
    WHERE id = NEW.service_id;

    NEW.end_time = NEW.start_time + INTERVAL '1 minute' * service_duration;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para calcular end_time
CREATE TRIGGER calculate_end_time_on_reservation
    BEFORE INSERT ON public.reservations
    FOR EACH ROW EXECUTE FUNCTION public.calculate_reservation_end_time();

-- Función para validar conflictos de horario
CREATE OR REPLACE FUNCTION public.check_reservation_conflict()
RETURNS TRIGGER AS $$
BEGIN
    -- Verificar que no haya otra reserva en el mismo horario para el mismo barbero
    IF EXISTS (
        SELECT 1 FROM public.reservations
        WHERE barber_id = NEW.barber_id
        AND reservation_date = NEW.reservation_date
        AND status IN ('pending', 'confirmed')
        AND (
            (NEW.start_time >= start_time AND NEW.start_time < end_time) OR
            (NEW.end_time > start_time AND NEW.end_time <= end_time) OR
            (NEW.start_time <= start_time AND NEW.end_time >= end_time)
        )
        AND id != COALESCE(NEW.id, '00000000-0000-0000-0000-000000000000'::UUID)
    ) THEN
        RAISE EXCEPTION 'El barbero ya tiene una reserva en este horario';
    END IF;

    -- Verificar que el barbero esté disponible en ese horario
    IF NOT EXISTS (
        SELECT 1 FROM public.barber_availability
        WHERE barber_id = NEW.barber_id
        AND date = NEW.reservation_date
        AND is_available = TRUE
        AND NEW.start_time >= start_time
        AND NEW.end_time <= end_time
    ) THEN
        RAISE EXCEPTION 'El barbero no está disponible en este horario';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para validar conflictos
CREATE TRIGGER check_reservation_conflict_trigger
    BEFORE INSERT OR UPDATE ON public.reservations
    FOR EACH ROW EXECUTE FUNCTION public.check_reservation_conflict();

-- Función para validar cancelación anticipada (24 horas)
CREATE OR REPLACE FUNCTION public.check_cancellation_policy()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.status IN ('pending', 'confirmed') AND NEW.status = 'cancelled' THEN
        IF (OLD.reservation_date + OLD.start_time::TIME) - NOW() < INTERVAL '24 hours' THEN
            RAISE EXCEPTION 'Las reservas solo pueden cancelarse con 24 horas de anticipación';
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para política de cancelación
CREATE TRIGGER check_cancellation_policy_trigger
    BEFORE UPDATE ON public.reservations
    FOR EACH ROW EXECUTE FUNCTION public.check_cancellation_policy();

-- Índices
CREATE INDEX idx_barber_availability_barber_date ON public.barber_availability(barber_id, date);
CREATE INDEX idx_reservations_client ON public.reservations(client_id);
CREATE INDEX idx_reservations_barber ON public.reservations(barber_id);
CREATE INDEX idx_reservations_date ON public.reservations(reservation_date);
CREATE INDEX idx_reservations_status ON public.reservations(status);
CREATE INDEX idx_payments_reservation ON public.payments(reservation_id);
```

---

## 📧 **SCHEMA 4: NOTIFICACIONES**

**Archivo: `supabase-schema-4-notifications.sql`**

```sql
-- ===========================================
-- SCHEMA 4: NOTIFICACIONES
-- ===========================================

-- Tabla de notificaciones
CREATE TABLE public.notifications (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('reservation_confirmed', 'reservation_reminder', 'reservation_cancelled', 'payment_success', 'admin_alert')),
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    related_reservation_id UUID REFERENCES public.reservations(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Tabla de plantillas de email
CREATE TABLE public.email_templates (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    subject TEXT NOT NULL,
    html_content TEXT NOT NULL,
    text_content TEXT NOT NULL,
    variables TEXT[], -- Array de variables disponibles
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Políticas RLS
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_templates ENABLE ROW LEVEL SECURITY;

-- Notificaciones: Usuarios pueden ver sus propias notificaciones
CREATE POLICY "Users can view their notifications" ON public.notifications
    FOR SELECT USING (user_id = auth.uid());

-- Notificaciones: Sistema puede crear notificaciones
CREATE POLICY "System can create notifications" ON public.notifications
    FOR INSERT WITH CHECK (TRUE);

-- Notificaciones: Usuarios pueden marcar como leídas sus notificaciones
CREATE POLICY "Users can update their notifications" ON public.notifications
    FOR UPDATE USING (user_id = auth.uid());

-- Templates: Solo super admins pueden gestionar
CREATE POLICY "Super admins can manage email templates" ON public.email_templates
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'super_admin'
        )
    );

-- Templates: Todos pueden ver templates activos (para envío)
CREATE POLICY "Anyone can view active templates" ON public.email_templates
    FOR SELECT USING (is_active = TRUE);

-- Trigger
CREATE TRIGGER handle_updated_at_email_templates
    BEFORE UPDATE ON public.email_templates
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Insertar plantillas de email por defecto
INSERT INTO public.email_templates (name, subject, html_content, text_content, variables) VALUES
('reservation_confirmation', 'Confirmación de Reserva - Brookings Barber',
 '<h1>¡Reserva Confirmada!</h1><p>Hola {{client_name}},</p><p>Tu reserva ha sido confirmada para el {{date}} a las {{time}} con {{barber_name}}.</p><p>Servicio: {{service_name}}</p><p>Precio: ${{price}}</p><p>¡Te esperamos!</p>',
 '¡Reserva Confirmada! Hola {{client_name}}, Tu reserva ha sido confirmada para el {{date}} a las {{time}} con {{barber_name}}. Servicio: {{service_name}}. Precio: ${{price}}. ¡Te esperamos!',
 ARRAY['client_name', 'date', 'time', 'barber_name', 'service_name', 'price']),

('reservation_reminder', 'Recordatorio de Cita - Brookings Barber',
 '<h1>Recordatorio de tu Cita</h1><p>Hola {{client_name}},</p><p>Te recordamos tu cita mañana {{date}} a las {{time}} con {{barber_name}}.</p><p>Servicio: {{service_name}}</p><p>Dirección: 1675 79th St, Brooklyn, NY</p>',
 'Recordatorio de tu Cita. Hola {{client_name}}, Te recordamos tu cita mañana {{date}} a las {{time}} con {{barber_name}}. Servicio: {{service_name}}. Dirección: 1675 79th St, Brooklyn, NY',
 ARRAY['client_name', 'date', 'time', 'barber_name', 'service_name']),

('reservation_cancelled', 'Reserva Cancelada - Brookings Barber',
 '<h1>Reserva Cancelada</h1><p>Hola {{client_name}},</p><p>Tu reserva para el {{date}} a las {{time}} ha sido cancelada.</p><p>Si deseas reagendar, puedes hacerlo desde nuestra plataforma.</p>',
 'Reserva Cancelada. Hola {{client_name}}, Tu reserva para el {{date}} a las {{time}} ha sido cancelada. Si deseas reagendar, puedes hacerlo desde nuestra plataforma.',
 ARRAY['client_name', 'date', 'time']);

-- Función para crear notificación automática al confirmar reserva
CREATE OR REPLACE FUNCTION public.create_reservation_notification()
RETURNS TRIGGER AS $$
DECLARE
    client_name TEXT;
    barber_name TEXT;
    service_name TEXT;
BEGIN
    IF NEW.status = 'confirmed' AND OLD.status != 'confirmed' THEN
        -- Obtener nombres
        SELECT full_name INTO client_name FROM public.profiles WHERE id = NEW.client_id;
        SELECT full_name INTO barber_name FROM public.profiles WHERE id = NEW.barber_id;
        SELECT name INTO service_name FROM public.services WHERE id = NEW.service_id;

        -- Notificación para el cliente
        INSERT INTO public.notifications (user_id, type, title, message, related_reservation_id)
        VALUES (
            NEW.client_id,
            'reservation_confirmed',
            'Reserva Confirmada',
            'Tu reserva para el ' || TO_CHAR(NEW.reservation_date, 'DD/MM/YYYY') || ' a las ' || TO_CHAR(NEW.start_time, 'HH24:MI') || ' ha sido confirmada.',
            NEW.id
        );

        -- Notificación para el barbero
        INSERT INTO public.notifications (user_id, type, title, message, related_reservation_id)
        VALUES (
            NEW.barber_id,
            'reservation_confirmed',
            'Nueva Reserva Asignada',
            'Tienes una nueva reserva con ' || client_name || ' para el ' || TO_CHAR(NEW.reservation_date, 'DD/MM/YYYY') || ' a las ' || TO_CHAR(NEW.start_time, 'HH24:MI') || '.',
            NEW.id
        );
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para notificaciones automáticas
CREATE TRIGGER create_reservation_notification_trigger
    AFTER UPDATE ON public.reservations
    FOR EACH ROW EXECUTE FUNCTION public.create_reservation_notification();

-- Índices
CREATE INDEX idx_notifications_user ON public.notifications(user_id);
CREATE INDEX idx_notifications_read ON public.notifications(is_read);
CREATE INDEX idx_notifications_type ON public.notifications(type);
CREATE INDEX idx_email_templates_active ON public.email_templates(is_active);
```

---

## 🔐 **SCHEMA 5: FUNCIONES DE UTILIDAD**

**Archivo: `supabase-schema-5-utils.sql`**

```sql
-- ===========================================
-- SCHEMA 5: FUNCIONES DE UTILIDAD
-- ===========================================

-- Función para obtener horarios disponibles de un barbero en una fecha
CREATE OR REPLACE FUNCTION public.get_available_slots(
    p_barber_id UUID,
    p_date DATE,
    p_service_id UUID DEFAULT NULL
)
RETURNS TABLE (
    start_time TIME,
    end_time TIME,
    is_available BOOLEAN
) AS $$
DECLARE
    service_duration INTEGER := 30; -- Default 30 minutos
    business_open TIME;
    business_close TIME;
    slot_start TIME;
    slot_end TIME;
BEGIN
    -- Obtener duración del servicio si se especifica
    IF p_service_id IS NOT NULL THEN
        SELECT duration_minutes INTO service_duration
        FROM public.services
        WHERE id = p_service_id;
    END IF;

    -- Obtener horarios de negocio para el día
    SELECT open_time, close_time INTO business_open, business_close
    FROM public.business_hours
    WHERE day_of_week = EXTRACT(DOW FROM p_date)::INTEGER
    AND is_closed = FALSE;

    -- Si el negocio está cerrado, retornar vacío
    IF business_open IS NULL THEN
        RETURN;
    END IF;

    -- Generar slots de 30 minutos desde apertura hasta cierre - duración del servicio
    slot_start := business_open;
    WHILE slot_start < (business_close - INTERVAL '1 minute' * service_duration) LOOP
        slot_end := slot_start + INTERVAL '1 minute' * service_duration;

        -- Verificar si el slot está disponible
        RETURN QUERY
        SELECT
            slot_start,
            slot_end,
            CASE
                WHEN EXISTS (
                    SELECT 1 FROM public.barber_availability
                    WHERE barber_id = p_barber_id
                    AND date = p_date
                    AND is_available = FALSE
                    AND (
                        (slot_start >= start_time AND slot_start < end_time) OR
                        (slot_end > start_time AND slot_end <= end_time)
                    )
                ) THEN FALSE
                WHEN EXISTS (
                    SELECT 1 FROM public.reservations
                    WHERE barber_id = p_barber_id
                    AND reservation_date = p_date
                    AND status IN ('pending', 'confirmed')
                    AND (
                        (slot_start >= start_time AND slot_start < end_time) OR
                        (slot_end > start_time AND slot_end <= end_time)
                    )
                ) THEN FALSE
                ELSE TRUE
            END as is_available;

        slot_start := slot_start + INTERVAL '30 minutes';
    END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para validar email único (excepto el actual)
CREATE OR REPLACE FUNCTION public.is_email_available(p_email TEXT, p_exclude_user_id UUID DEFAULT NULL)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN NOT EXISTS (
        SELECT 1 FROM public.profiles
        WHERE email = p_email
        AND (p_exclude_user_id IS NULL OR id != p_exclude_user_id)
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para validar teléfono único (excepto el actual)
CREATE OR REPLACE FUNCTION public.is_phone_available(p_phone TEXT, p_exclude_user_id UUID DEFAULT NULL)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN NOT EXISTS (
        SELECT 1 FROM public.profiles
        WHERE phone = p_phone
        AND (p_exclude_user_id IS NULL OR id != p_exclude_user_id)
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para obtener estadísticas del dashboard
CREATE OR REPLACE FUNCTION public.get_dashboard_stats(p_user_id UUID, p_role TEXT)
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    IF p_role = 'cliente' THEN
        SELECT json_build_object(
            'total_reservations', COUNT(*),
            'upcoming_reservations', COUNT(*) FILTER (WHERE reservation_date >= CURRENT_DATE AND status IN ('pending', 'confirmed')),
            'completed_reservations', COUNT(*) FILTER (WHERE status = 'completed'),
            'cancelled_reservations', COUNT(*) FILTER (WHERE status = 'cancelled')
        ) INTO result
        FROM public.reservations
        WHERE client_id = p_user_id;

    ELSIF p_role = 'barbero' THEN
        SELECT json_build_object(
            'today_reservations', COUNT(*) FILTER (WHERE reservation_date = CURRENT_DATE AND status IN ('pending', 'confirmed')),
            'week_reservations', COUNT(*) FILTER (WHERE reservation_date >= CURRENT_DATE AND reservation_date <= CURRENT_DATE + INTERVAL '7 days' AND status IN ('pending', 'confirmed')),
            'total_earnings', COALESCE(SUM(r.total_price), 0),
            'completion_rate', ROUND(
                COUNT(*) FILTER (WHERE status = 'completed')::DECIMAL /
                NULLIF(COUNT(*) FILTER (WHERE status IN ('completed', 'no_show')), 0) * 100, 2
            )
        ) INTO result
        FROM public.reservations r
        WHERE barber_id = p_user_id;

    ELSIF p_role = 'super_admin' THEN
        SELECT json_build_object(
            'total_users', (SELECT COUNT(*) FROM public.profiles),
            'total_reservations', (SELECT COUNT(*) FROM public.reservations),
            'today_reservations', (SELECT COUNT(*) FROM public.reservations WHERE reservation_date = CURRENT_DATE AND status IN ('pending', 'confirmed')),
            'total_revenue', (SELECT COALESCE(SUM(amount), 0) FROM public.payments WHERE status = 'completed')
        ) INTO result;
    END IF;

    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

---

## 🚀 **INSTRUCCIONES DE IMPLEMENTACIÓN EN SUPABASE**

### **Paso 1: Crear el Proyecto**
1. Ve a [Supabase Dashboard](https://supabase.com/dashboard)
2. Crea un nuevo proyecto
3. Espera a que se complete la configuración

### **Paso 2: Ejecutar los Schemas en Orden**
```sql
-- Ejecutar en el SQL Editor de Supabase, EN ESTE ORDEN:

1. supabase-schema-1-auth.sql
2. supabase-schema-2-services.sql
3. supabase-schema-3-reservations.sql
4. supabase-schema-4-notifications.sql
5. supabase-schema-5-utils.sql
```

### **Paso 3: Configurar Autenticación**
1. Ve a **Authentication > Settings**
2. Configura:
   - Site URL: `http://localhost:3000`
   - Redirect URLs: `http://localhost:3000/auth/callback`
3. Habilita email confirmations

### **Paso 4: Configurar Storage (Opcional)**
```sql
-- Para subir avatares de usuario
CREATE BUCKET public.avatars WITH (public = true);
```

### **Paso 5: Verificar Funcionamiento**
```sql
-- Ejecuta estas consultas para verificar:
SELECT * FROM public.profiles LIMIT 5;
SELECT * FROM public.services WHERE is_active = true;
SELECT * FROM public.business_hours ORDER BY day_of_week;
```

---

## 📱 **INTEGRACIÓN CON NEXT.JS**

### **Variables de Entorno (.env.local)**
```env
NEXT_PUBLIC_SUPABASE_URL=tu_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key
NEXT_PASS_ADMISN=soloadmins123
NEXT_PASS_BARBERS=solobarbers123
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_TIMEZONE=America/New_York
```

### **Instalación de Dependencias**
```bash
npm install @supabase/supabase-js @supabase/auth-helpers-nextjs @supabase/auth-helpers-react
```

### **Configuración del Cliente Supabase**
```typescript
// lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})
