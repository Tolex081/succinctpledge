import React from 'react';

const CommunityPledges = ({ pledges, onPledgeClick }) => {
  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 glow">
      <h2 className="text-4xl font-black text-center mb-8 gradient-text">Community Pledges</h2>
      
      {/* Stats */}
      <div className="flex justify-center mb-8">
        <div className="bg-gradient-to-r from-purple-600/50 to-pink-600/50 rounded-full px-8 py-4">
          <span className="text-xl font-black">{pledges.length} Loyal Warriors Have Pledged!</span>
        </div>
      </div>
      
      {/* Pledges Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4 min-h-[200px]">
        {pledges.length === 0 ? (
          <div className="col-span-full flex items-center justify-center py-16">
            <div className="text-center text-purple-300">
              <div className="text-6xl mb-4 font-black">PLEDGE</div>
              <p className="text-2xl font-bold">Be the first to pledge allegiance!</p>
              <p className="text-lg mt-2 font-semibold">Your pledge will appear here for all to see</p>
            </div>
          </div>
        ) : (
          pledges.map((pledge, index) => (
            <PledgeBall 
              key={`${pledge.username}-${pledge.timestamp.getTime()}`}
              pledge={pledge}
              onClick={() => onPledgeClick(pledge)}
            />
          ))
        )}
      </div>
    </div>
  );
};

const PledgeBall = ({ pledge, onClick }) => {
  return (
    <div 
      className="pledge-ball w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center border-2 border-white/30 pulse-glow cursor-pointer"
      onClick={onClick}
      title={`${pledge.username} - Click to view pledge`}
    >
      <img 
        src={pledge.profileUrl} 
        alt={pledge.username}
        className="w-full h-full object-cover rounded-full"
        onError={(e) => {
          e.target.style.display = 'none';
          e.target.parentElement.innerHTML = '<span class="text-2xl font-bold text-white">PFP</span>';
        }}
      />
    </div>
  );
};

export default CommunityPledges;