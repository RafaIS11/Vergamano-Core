
import { useGame } from '../../context/GameContext';
import { TaskCard } from './TaskCard';

const ArenaView = () => {
  const { missions, activePillar } = useGame();

  const filteredMissions = activePillar
    ? missions.filter(m => m.pilar === activePillar)
    : missions;

  return (
    <div className="space-y-16">
      <div className="flex justify-between items-end border-b-6 border-black pb-6">
        <div>
          <h2 className="game-title text-6xl">LA_ARENA</h2>
          <p className="marker-font text-xl text-red-600 mt-2">Misiones_Diarias_Disponibles</p>
        </div>
        {activePillar && (
          <div className="bg-red-600 text-white px-6 py-2 font-black uppercase text-sm transform -rotate-2">
            Sector_{activePillar.toUpperCase()}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-12 max-w-5xl">
        {filteredMissions.length > 0 ? (
          filteredMissions.map(mission => (
            <TaskCard key={mission.id} mission={mission} />
          ))
        ) : (
          <div className="p-32 border-8 border-dashed border-gray-200 text-center text-4xl font-black opacity-20">
            SIN_ACTIVIDAD_DETECTADA
          </div>
        )}
      </div>
    </div>
  );
};

export default ArenaView;
