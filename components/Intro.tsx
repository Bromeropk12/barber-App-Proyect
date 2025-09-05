import './intro.css';

export default function Intro() {
  return (
    <section className="intro-container">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl font-bold mb-6 text-center animate-fade-in">
          ¿Por qué elegir Brookings Barber?
        </h2>
        <p className="text-lg text-center animate-slide-in">
          Transforma tu estilo con cortes impecables y una experiencia premium que solo Brookings Barber Shop puede ofrecer.  
          No pierdas más tiempo, <span className="font-bold underline">reserva ahora</span> y luce como un rey en Brooklyn.
        </p>
      </div>
    </section>
  )
}
