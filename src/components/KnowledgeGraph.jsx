// KnowledgeGraph.js
import React, { useEffect, useRef } from 'react';
import data from './dummy.json'; // Adjust the path if necessary

const htmlContent = (data, selectedCategories) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>3D Force-Directed Graph</title>
    <style>
        body { margin: 0; }
        #3d-graph { width: 100vw; height: 100vh; }
    </style>
</head>
<body>
    <div id="3d-graph"></div>
    <script src="https://unpkg.com/3d-force-graph-vr"></script>
    <script>
        (function() {
            function transformData(data) {
                const nodes = [];
                const links = [];
                const nodeSet = new Set();

                data.forEach(item => {
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
            }

            const graphData = transformData(${JSON.stringify(data)});

            const Graph = ForceGraphVR()
                (document.getElementById('3d-graph'))
                .graphData(graphData)
                .nodeLabel('id')
                .nodeAutoColorBy('group')
                .linkDirectionalParticles(2)
                .linkDirectionalParticleSpeed(d => d.value * 0.001);
        })();
    </script>
</body>
</html>
`;

const KnowledgeGraph = ({ width = '100%', height = '100%' }) => {
  const iframeRef = useRef(null);

  useEffect(() => {
    const iframe = iframeRef.current;
    const doc = iframe.contentDocument || iframe.contentWindow.document;

    doc.open();
    doc.write(htmlContent(data));
    doc.close();

    // Cleanup function to prevent multiple script loading issues
    return () => {
      doc.open();
      doc.write('');
      doc.close();
    };
  }, []);

  return (
    <iframe
      ref={iframeRef}
      title="3D Force-Directed Graph"
      style={{ width, height, border: 'none' }}
    />
  );
};

export default KnowledgeGraph;
