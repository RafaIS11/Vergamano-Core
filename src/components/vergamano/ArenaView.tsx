import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

interface Task {
  id: string;
  title: string;
  description: string;
  power: string;
  xp_base: number;
  status: string;
}

export const ArenaView: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    const fetchTasks = async () => {
      const { data } = await supabase
        .from('tasks')
        .select('*')
        .eq('status', 'Todo')
        .order('created_at', { ascending: false });
      if (data) setTasks(data);
    };
    fetchTasks();
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-6xl font-black italic border-b-8 border-black pb-4">ARENA_MISS_01</h2>
      <div className="grid gap-4">
        {tasks.map(task => (
          <div key={task.id} className="border-8 border-black p-6 bg-white hover:bg-red-600 hover:text-white transition-colors group">
            <div className="flex justify-between items-center mb-4">
              <span className="bg-black text-white px-3 py-1 text-xs font-black group-hover:bg-white group-hover:text-black uppercase">{task.power}</span>
              <span className="text-4xl font-black italic">+{task.xp_base} XP</span>
            </div>
            <h3 className="text-4xl font-black uppercase mb-2">{task.title}</h3>
            <p className="font-bold mb-4">{task.description}</p>
            <button className="w-full border-4 border-black py-2 font-black uppercase group-hover:border-white">Enviar Prueba →</button>
          </div>
        ))}
      </div>
    </div>
  );
};
