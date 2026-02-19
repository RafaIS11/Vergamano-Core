
import { useGame } from '../../context/GameContext';
import { TaskCard } from './TaskCard';

export const ArenaView = () => {
  const { missions } = useGame();

  return (
    <div className="max-w-4xl mx-auto py-10">
      <div className="mb-12">
        <h2 className="basquiat-font text-6xl uppercase mb-2">LA_ARENA</h2>
        <p className="typewriter text-lg bg-black text-white inline-block px-4 py-1">
          OPERACIONES_ACTIVAS_CENTRO_DE_MANDO
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <section>
          <h3 className="basquiat-font text-2xl mb-6 border-b-4 border-black inline-block">MISIONES_DISPONIBLES</h3>
          {missions?.filter(m => m.status === 'pending').length === 0 ? (
            <p className="font-mono italic text-gray-500">Moltbot está preparando nuevas órdenes...</p>
          ) : (
            missions?.filter(m => m.status === 'pending').map(task => (
              <TaskCard key={task.id} task={task} />
            ))
          )}
        </section>

        <section>
          <h3 className="basquiat-font text-2xl mb-6 border-b-4 border-black inline-block">EN_CURSO</h3>
          {missions?.filter(m => m.status === 'active').length === 0 ? (
            <div className="basquiat-border p-10 text-center opacity-30">
              <p className="basquiat-font text-xl">NO_HAY_OPERACIONES</p>
            </div>
          ) : (
            missions?.filter(m => m.status === 'active').map(task => (
              <TaskCard key={task.id} task={task} />
            ))
          )}
        </section>
      </div>

      {/* Botón de Emergencia para hablar con Moltbot */}
      <div className="mt-20 border-t-8 border-black pt-10">
        <div className="banksy-card text-center text-2xl">
          ¿PERDIDO? ENVÍA UN MENSAJE AL ENLACE NEURAL
        </div>
      </div>
    </div>
  );
};

export default ArenaView;
