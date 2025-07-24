import React, { useRef, useEffect, useState } from 'react';

const CommunityPledges = ({ pledges, onPledgeClick, loading }) => {
  const [showNetwork, setShowNetwork] = useState(false);
  const [networkNodes, setNetworkNodes] = useState([]);

  // Generate network connections and positions
  useEffect(() => {
    if (!pledges.length || loading) {
      setNetworkNodes({ nodes: [], connections: [] });
      return;
    }

    const generateNetworkNodes = () => {
      const nodeCount = Math.min(pledges.length, 20);
      
      // Create cluster centers for more organic grouping
      const clusterCount = Math.min(Math.ceil(nodeCount / 5), 4); // 3-5 nodes per cluster
      const clusters = [];
      
      // Generate cluster centers with more spacing
      for (let i = 0; i < clusterCount; i++) {
        const angle = (i / clusterCount) * Math.PI * 2;
        const radius = 25 + Math.random() * 15; // Increased spacing between clusters
        clusters.push({
          x: 50 + Math.cos(angle) * radius + (Math.random() - 0.5) * 10,
          y: 50 + Math.sin(angle) * radius + (Math.random() - 0.5) * 10
        });
      }
      
      // Assign nodes to clusters and position them with collision detection
      const nodes = [];
      const minDistance = 8; // Minimum distance between nodes (in percentage)
      
      pledges.slice(0, 20).forEach((pledge, index) => {
        const clusterIndex = index % clusterCount;
        const cluster = clusters[clusterIndex];
        
        let attempts = 0;
        let position;
        
        // Try to find a non-overlapping position
        do {
          const nodeAngle = Math.random() * Math.PI * 2;
          const nodeRadius = 4 + Math.random() * 8; // Cluster radius
          
          position = {
            x: cluster.x + Math.cos(nodeAngle) * nodeRadius + (Math.random() - 0.5) * 6,
            y: cluster.y + Math.sin(nodeAngle) * nodeRadius + (Math.random() - 0.5) * 6
          };
          
          attempts++;
        } while (
          attempts < 50 && 
          nodes.some(existingNode => {
            const distance = Math.sqrt(
              Math.pow(position.x - existingNode.x, 2) + 
              Math.pow(position.y - existingNode.y, 2)
            );
            return distance < minDistance;
          })
        );
        
        // If we couldn't find a good position after 50 attempts, use a fallback position
        if (attempts >= 50) {
          const fallbackAngle = (index / nodeCount) * Math.PI * 2;
          const fallbackRadius = 30 + (index % 3) * 8;
          position = {
            x: 50 + Math.cos(fallbackAngle) * fallbackRadius,
            y: 50 + Math.sin(fallbackAngle) * fallbackRadius
          };
        }
        
        nodes.push({
          ...pledge,
          x: position.x,
          y: position.y,
          id: pledge.id || `${pledge.username}-${index}`,
          cluster: clusterIndex
        });
      });

      // Generate smarter connections - prefer same cluster, some cross-cluster
      const connections = [];
      nodes.forEach((node, index) => {
        const sameClusterNodes = nodes.filter(n => n.cluster === node.cluster && n.id !== node.id);
        const otherClusterNodes = nodes.filter(n => n.cluster !== node.cluster);
        
        // Connect to 2-3 nodes in same cluster (closer connections)
        const sameClusterConnections = Math.min(2 + Math.floor(Math.random() * 2), sameClusterNodes.length);
        for (let i = 0; i < sameClusterConnections; i++) {
          const randomNode = sameClusterNodes[Math.floor(Math.random() * sameClusterNodes.length)];
          if (randomNode && !connections.some(conn => 
            (conn.from === node.id && conn.to === randomNode.id) ||
            (conn.from === randomNode.id && conn.to === node.id)
          )) {
            connections.push({
              from: node.id,
              to: randomNode.id,
              fromX: node.x,
              fromY: node.y,
              toX: randomNode.x,
              toY: randomNode.y,
              type: 'cluster' // Mark as cluster connection
            });
          }
        }
        
        // Connect to 1-2 nodes in other clusters (bridge connections)
        if (otherClusterNodes.length > 0 && Math.random() > 0.3) {
          const bridgeConnections = Math.min(1 + Math.floor(Math.random() * 2), 2);
          for (let i = 0; i < bridgeConnections; i++) {
            const randomNode = otherClusterNodes[Math.floor(Math.random() * otherClusterNodes.length)];
            if (randomNode && !connections.some(conn => 
              (conn.from === node.id && conn.to === randomNode.id) ||
              (conn.from === randomNode.id && conn.to === node.id)
            )) {
              connections.push({
                from: node.id,
                to: randomNode.id,
                fromX: node.x,
                fromY: node.y,
                toX: randomNode.x,
                toY: randomNode.y,
                type: 'bridge' // Mark as bridge connection
              });
            }
          }
        }
      });

      console.log('Generated network nodes:', nodes.length, 'connections:', connections.length);
      setNetworkNodes({ nodes, connections });
    };

    generateNetworkNodes();
  }, [pledges, loading, showNetwork]);

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 glow">
      <div className="flex items-center justify-center mb-8">
        <h2 className="text-4xl font-black gradient-text mr-4">
          {showNetwork ? 'Community Network' : 'Community Pledges'}
        </h2>
        {pledges.length > 1 && (
          <button
            onClick={() => setShowNetwork(!showNetwork)}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-2 px-4 rounded-full transition-all duration-300 text-sm"
          >
            {showNetwork ? 'Grid View' : 'Network View'}
          </button>
        )}
      </div>
             
      {/* Stats */}
      <div className="flex justify-center mb-8">
        <div className="bg-gradient-to-r from-purple-600/50 to-pink-600/50 rounded-full px-8 py-4">
          <span className="text-xl font-black">
            {loading ? 'Loading...' : `${pledges.length} ${showNetwork ? 'Connected Warriors!' : 'Loyal Warriors Have Pledged!'}`}
          </span>
        </div>
      </div>
             
      {/* Loading State */}
      {loading && (
        <div className="flex justify-center py-16">
          <div className="text-center text-purple-300">
            <div className="animate-spin w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-lg font-bold">Loading pledges...</p>
          </div>
        </div>
      )}
             
      {/* Pledges Display */}
      {!loading && (
        <>
          {pledges.length === 0 ? (
            <div className="flex items-center justify-center py-16">
              <div className="text-center text-purple-300">
                <div className="text-6xl mb-4 font-black">PLEDGE</div>
                <p className="text-2xl font-bold">Be the first to pledge allegiance!</p>
                <p className="text-lg mt-2 font-semibold">Your pledge will appear here for all to see</p>
              </div>
            </div>
          ) : showNetwork ? (
            <NetworkVisualization 
              networkNodes={networkNodes}
              onNodeClick={onPledgeClick}
            />
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4 min-h-[200px]">
              {pledges.map((pledge) => (
                <PledgeBall 
                  key={pledge.id || `${pledge.username}-${pledge.timestamp?.getTime ? pledge.timestamp.getTime() : Date.now()}`}
                  pledge={pledge}
                  onClick={() => onPledgeClick(pledge)}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

// Network Visualization Component
const NetworkVisualization = ({ networkNodes, onNodeClick }) => {
  const containerRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 500 });

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setDimensions({
          width: Math.max(600, rect.width - 32), // Account for padding
          height: 500
        });
      }
    };

    // Small delay to ensure container is rendered
    setTimeout(updateDimensions, 100);
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  if (!networkNodes.nodes || networkNodes.nodes.length === 0) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center text-purple-300">
          <div className="text-4xl mb-4 font-black">🔗</div>
          <p className="text-xl font-bold">Network loading...</p>
        </div>
      </div>
    );
  }

  const { nodes, connections } = networkNodes;
  console.log('Rendering network with', nodes.length, 'nodes and', connections.length, 'connections');

  return (
    <div ref={containerRef} className="w-full h-[500px] overflow-hidden rounded-2xl bg-gradient-to-br from-blue-900/20 to-purple-900/20 border border-white/10 relative">
      {/* Network connections overlay */}
      <svg
        width="100%"
        height="100%"
        viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ background: 'radial-gradient(circle at center, rgba(59, 130, 246, 0.05) 0%, rgba(147, 51, 234, 0.05) 100%)' }}
      >
        <defs>
          <linearGradient id="connectionGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(168, 85, 247, 0.8)" />
            <stop offset="50%" stopColor="rgba(59, 130, 246, 0.6)" />
            <stop offset="100%" stopColor="rgba(236, 72, 153, 0.8)" />
          </linearGradient>
        </defs>
        
        {/* Connection lines with different styles for cluster vs bridge connections */}
        {connections.map((connection, index) => {
          const fromX = (connection.fromX / 100) * dimensions.width;
          const fromY = (connection.fromY / 100) * dimensions.height;
          const toX = (connection.toX / 100) * dimensions.width;
          const toY = (connection.toY / 100) * dimensions.height;
          
          const isClusterConnection = connection.type === 'cluster';
          
          return (
            <line
              key={`connection-${index}`}
              x1={fromX}
              y1={fromY}
              x2={toX}
              y2={toY}
              stroke={isClusterConnection ? "rgba(168, 85, 247, 0.9)" : "rgba(59, 130, 246, 0.7)"}
              strokeWidth={isClusterConnection ? "3" : "2"}
              opacity={isClusterConnection ? "0.8" : "0.5"}
              className="animate-pulse"
              style={{
                animationDelay: `${index * 0.1}s`,
                animationDuration: `${1.5 + Math.random() * 1}s`
              }}
            />
          );
        })}
      </svg>
      
      {/* Profile nodes positioned absolutely */}
      <div className="relative w-full h-full">
        {nodes.map((node) => {
          const nodeX = (node.x / 100) * dimensions.width;
          const nodeY = (node.y / 100) * dimensions.height;
          
          return (
            <div
              key={node.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10"
              style={{ 
                left: `${nodeX}px`, 
                top: `${nodeY}px`
              }}
            >
              <NetworkPledgeBall 
                pledge={node}
                onClick={() => onNodeClick(node)}
              />
            </div>
          );
        })}
      </div>
      
      {/* Debug info - remove this after testing */}
      <div className="absolute top-2 left-2 text-xs text-white/70 bg-black/30 p-2 rounded">
        Nodes: {nodes.length} | Connections: {connections.length} | Size: {dimensions.width}x{dimensions.height}
      </div>
    </div>
  );
};

// Network version of PledgeBall with enhanced styling (no username)
const NetworkPledgeBall = ({ pledge, onClick }) => {
  const getProfileUrl = () => {
    // More robust profile URL handling with multiple fallbacks
    if (pledge.profileUrl) return pledge.profileUrl;
    if (pledge.profilePicture) return pledge.profilePicture;
    if (pledge.avatar) return pledge.avatar;
    if (pledge.profileImage) return pledge.profileImage;
    if (pledge.username) return `https://unavatar.io/x/${pledge.username}`;
    return `https://unavatar.io/fallback/${pledge.id || 'user'}`;
  };

  return (
    <div 
      className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 border-2 border-white/50 shadow-lg shadow-purple-500/30 hover:shadow-purple-500/60 transition-all duration-300 hover:scale-110 flex items-center justify-center overflow-hidden cursor-pointer group"
      onClick={() => {
        console.log('Clicked network pledge:', pledge); // Debug log
        onClick(pledge);
      }}
      title={pledge.username || 'Anonymous'} // Show username on hover only
    >
      <img 
        src={getProfileUrl()}
        alt={pledge.username || 'User'}
        className="w-full h-full object-cover rounded-full"
        onError={(e) => {
          console.log('Network image failed to load for pledge:', pledge);
          e.target.style.display = 'none';
          e.target.parentElement.innerHTML = '<span class="text-xs font-bold text-white">PFP</span>';
        }}
      />
    </div>
  );
};

const PledgeBall = ({ pledge, onClick }) => {
  // Handle both Firestore timestamp and regular Date objects
  const getProfileUrl = () => {
    // More robust profile URL handling with multiple fallbacks
    if (pledge.profileUrl) return pledge.profileUrl;
    if (pledge.profilePicture) return pledge.profilePicture;
    if (pledge.avatar) return pledge.avatar;
    if (pledge.profileImage) return pledge.profileImage;
    if (pledge.username) return `https://unavatar.io/x/${pledge.username}`;
    return `https://unavatar.io/fallback/${pledge.id || 'user'}`;
  };
  
  return (
    <div 
      className="pledge-ball w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center border-2 border-white/30 pulse-glow cursor-pointer"
      onClick={() => onClick(pledge)}
      title={`${pledge.username || 'Anonymous'} - Click to view pledge`}
    >
      <img 
        src={getProfileUrl()}
        alt={pledge.username || 'User'}
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