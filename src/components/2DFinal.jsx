import React, { useEffect, useRef, useState } from 'react';
import { DataSet, Network } from 'vis-network/standalone/esm/vis-network';
import dummyData from './dummy.json'; // Import JSON data

const SentientAIKnowledgeGraph = () => {
  const containerRef = useRef(null);
  const [network, setNetwork] = useState(null);

  useEffect(() => {
    const formattedData = formatData(dummyData); // Use imported JSON data directly
    const graphData = generateGraphData(formattedData);
    const options = generateOptions();

    const networkInstance = new Network(containerRef.current, graphData, options);
    setNetwork(networkInstance);

    // Clean up network instance on component unmount
    return () => {
      networkInstance.destroy();
    };
  }, []);

  const formatData = (jsonData) => {
    // Structure the data into hierarchical format
    const formattedData = {};
    jsonData.forEach(item => {
      const { question, category, expert, url, explanation } = item;
      if (!formattedData[question]) {
        formattedData[question] = {};
      }
      if (!formattedData[question][category]) {
        formattedData[question][category] = {};
      }
      if (!formattedData[question][category][expert]) {
        formattedData[question][category][expert] = [];
      }
      formattedData[question][category][expert].push({ url, explanation });
    });
    return formattedData;
  };

  const generateGraphData = (data) => {
    const nodes = new DataSet();
    const edges = new DataSet();

    let nodeIdCounter = 1;
    let edgeIdCounter = 1;

    // Create nodes for questions
    Object.keys(data).forEach(question => {
      const questionNodeId = nodeIdCounter++;
      nodes.add({
        id: questionNodeId,
        label: question,
        size: 30,
        color: '#f94144',
        shape: 'box',
        font: { size: 20 }
      });

      // Create nodes for categories
      Object.keys(data[question]).forEach(category => {
        const categoryNodeId = nodeIdCounter++;
        nodes.add({
          id: categoryNodeId,
          label: category,
          size: 25,
          color: '#f3722c',
          shape: 'box',
          font: { size: 18 }
        });
        edges.add({ id: edgeIdCounter++, from: questionNodeId, to: categoryNodeId });

        // Create nodes for experts
        Object.keys(data[question][category]).forEach(expert => {
          const expertNodeId = nodeIdCounter++;
          nodes.add({
            id: expertNodeId,
            label: expert,
            size: 20,
            color: '#f9c74f',
            shape: 'box',
            font: { size: 16 }
          });
          edges.add({ id: edgeIdCounter++, from: categoryNodeId, to: expertNodeId });

          // Create nodes for URLs (references)
          data[question][category][expert].forEach(reference => {
            const urlNodeId = nodeIdCounter++;
            nodes.add({
              id: urlNodeId,
              label: reference.url,
              size: 15,
              color: '#90be6d',
              shape: 'box',
              font: { size: 14 }
            });
            edges.add({ id: edgeIdCounter++, from: expertNodeId, to: urlNodeId });

            // Create nodes for explanations (under URLs)
            const explanationNodeId = nodeIdCounter++;
            nodes.add({
              id: explanationNodeId,
              label: reference.explanation,
              size: 10,
              color: '#577590',
              shape: 'box',
              font: { size: 12 }
            });
            edges.add({ id: edgeIdCounter++, from: urlNodeId, to: explanationNodeId });
          });
        });
      });
    });

    return { nodes, edges };
  };

  const generateOptions = () => {
    return {
      nodes: {
        shape: 'box',
        borderWidth: 1,
        borderWidthSelected: 2,
        chosen: true,
      },
      edges: {
        width: 1,
        color: { inherit: 'from' },
        selectionWidth: 2,
      },
      physics: {
        enabled: true,
        barnesHut: {
          gravitationalConstant: -6000, // Adjusted value
          springConstant: 0.03, // Adjusted value
          springLength: 200, // Adjusted value
        },
        //improvedLayout: false, // Disable improvedLayout for better performance
      },
      interaction: {
        hover: true,
        hoverConnectedEdges: true,
      },
      layout: { improvedLayout: false }
    };
  };

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        height: '800px',
        border: '1px solid lightgray',
      }}
    />
  );
};

export default SentientAIKnowledgeGraph;
