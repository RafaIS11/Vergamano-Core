
import { useGame } from '../../context/GameContext';
import { TaskCard } from './TaskCard';

const ArenaView = () => {
  const { missions, activePillar } = useGame();

  // Filtrar misiones por pilar si hay uno seleccionado
  const filteredMissions = activePillar
    ? missions.filter(m => m.pilar === activePillar)
    : missions;

  const available = filteredMissions.filter(m => m.status === 'pending');
  const inProgress = filteredMissions.filter(m => m.status === 'active');
  const auditing = filteredMissions.filter(m => m.status === 'auditing');

  return (
    <div className="space-y-16">
      <div className="flex justify-between items-end border-b-4 border-black pb-4">
        <h2 className="game-title text-5xl">Mission_Control</h2>
        {activePillar && (
          <span className="bg-black text-white px-4 py-1 font-bold animate-pulse">
            FILTERED_BY: {activePillar.toUpperCase()}
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="space-y-8">
          <h3 className="marker-font text-3xl text-red-600">// ACTIVE_OPERATIONS</h3>
          {inProgress.length > 0 ? (
            inProgress.map(mission => <TaskCard key={mission.id} mission={mission} />)
          ) : (
            <div className="p-10 border-4 border-dashed border-gray-300 text-center opacity-50 font-bold">
              NO_ACTIVE_TASKS. SELECT_MISSION_BELOW.
            </div>
          )}

          <h3 className="marker-font text-3xl text-blue-600">// AUDIT_PENDING</h3>
          {auditing.map(mission => <TaskCard key={mission.id} mission={mission} />)}
        </div>

        <div className="space-y-8">
          <h3 className="marker-font text-3xl">// AVAILABLE_INTEL</h3>
          <div className="grid grid-cols-1 gap-6">
            {available.map(mission => <TaskCard key={mission.id} mission={mission} />)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArenaView;
