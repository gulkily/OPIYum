import React, { useEffect, useRef } from 'react';
import ForceGraphVR from '3d-force-graph-vr';


const KnowledgeGraph = ({ data }) => {
  const graphRef = useRef();

  const transformData = (data) => {
    const nodes = [];
    const links = [];
    const nodeSet = new Set();

    data.forEach((item) => {
      const categoryNode = { id: item.category, group: 1 };
      const expertNode = { id: item.expert, group: 2 };
      const urlNode = { id: item.url, group: 3 };

      if (!nodeSet.has(categoryNode.id)) {
        nodes.push(categoryNode);
        nodeSet.add(categoryNode.id);
      }
      if (!nodeSet.has(expertNode.id)) {
        nodes.push(expertNode);
        nodeSet.add(expertNode.id);
      }
      if (!nodeSet.has(urlNode.id)) {
        nodes.push(urlNode);
        nodeSet.add(urlNode.id);
      }

      links.push({ source: categoryNode.id, target: expertNode.id });
      links.push({ source: expertNode.id, target: urlNode.id });
    });

    return { nodes, links };
  };

  useEffect(() => {
    if (data && graphRef.current) {
      const graphData = transformData(data);

      const Graph = ForceGraphVR()(graphRef.current)
        .graphData(graphData)
        .nodeLabel('id')
        .nodeAutoColorBy('group')
        .linkDirectionalParticles(2)
        .linkDirectionalParticleSpeed((d) => d.value * 0.001);
    }
  }, [data]);

  return <div id="3d-graph" ref={graphRef} style={{ width: '100vw', height: '100vh' }} />;
};

export default KnowledgeGraph;
