import { useState } from 'react';

interface ReferralNodeProps {
  user: { email: string; balance: number; level: number };
  children: ReferralNodeProps[];
}

export default function ReferralNode({ user, children }: ReferralNodeProps) {
  const = useState(false);

  return (
    <div className={`ml-${user.level * 4} border-l-2 border-yellow-500 pl-4`}>
      <div 
        className={`flex items-center p-3 rounded-lg cursor-pointer transition ${
          expanded ? 'bg-yellow-900/30' : 'bg-gray-800 hover:bg-gray-700'
        }`}
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex-1">
          <span className="font-bold text-yellow-400">Level {user.level}: {user.email}</span>
          <p className="text-sm text-gray-300">Balance: {user.balance.toFixed(2)} USDT</p>
        </div>
        {children.length > 0 && (
          <span className="text-xs bg-yellow-600 px-3 py-1 rounded">
            {expanded ? 'Collapse' : 'Expand'} ({children.length})
          </span>
        )}
      </div>

      {expanded && children.length > 0 && (
        <div className="mt-3 space-y-3">
          {children.map(child => (
            <ReferralNode 
              key={child.user.email} 
              user={child.user} 
              children={child.children || []} 
            />
          ))}
        </div>
      )}
    </div>
  );
}
