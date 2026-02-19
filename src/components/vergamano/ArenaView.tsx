
import { useGame } from '../../context/GameContext';
import { TaskCard } from './TaskCard';

const ArenaView = () => {
  const { missions, activePillar } = useGame();

  const filteredMissions = activePillar
    ? missions.filter(m => m.pilar === activePillar)
    : missions;

  const available = filteredMissions.filter(m => m.status === 'pending');
  const inProgress = filteredMissions.filter(m => m.status === 'active');
  const auditing = filteredMissions.filter(m => m.status === 'auditing');

  return (
    <div className="space-y-24">
      <div className="flex justify-between items-end border-b-2 border-black/10 pb-8">
        <div>
          <h2 className="game-title text-6xl">OPERATIONS</h2>
          <p className="opacity-40 font-bold uppercase tracking-widest text-xs mt-2">Active_Mission_Control</p>
        </div>
        {activePillar && (
          <span className="bg-black text-white px-6 py-2 font-black text-sm uppercase tracking-tighter">
            Sector_{activePillar}
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
        <div className="space-y-16">
          <div>
            <h3 className="game-title text-2xl mb-8 flex items-center gap-4">
              <span className="w-8 h-8 bg-red-600 rounded-full animate-pulse" /> CURRENT_STRIKE
            </h3>
            <div className="space-y-8">
              {inProgress.length > 0 ? (
                inProgress.map(mission => <TaskCard key={mission.id} mission={mission} />)
              ) : (
                <div className="p-20 border-2 border-dashed border-black/10 text-center opacity-30 font-black">
                  WAITING_FOR_ACTION
                </div>
              )}
            </div>
          </div>

          <div>
            <h3 className="game-title text-2xl mb-8 opacity-40">AUDIT_QUEUE</h3>
            <div className="space-y-8 opacity-60 grayscale">
              {auditing.map(mission => <TaskCard key={mission.id} mission={mission} />)}
            </div>
          </div>
        </div>

        <div className="space-y-12">
          <h3 className="game-title text-2xl mb-8">OPPORTUNITIES_INTEL</h3>
          <div className="grid grid-cols-1 gap-10">
            {available.map(mission => <TaskCard key={mission.id} mission={mission} />)}
          </div>
          {available.length === 0 && (
            <p className="text-center p-20 opacity-20 font-bold italic">No new signals detected in this sector.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ArenaView;
