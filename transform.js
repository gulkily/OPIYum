function transformData(data) {
    const nodes = [];
    const links = [];
    const categoryNode = {
      id: '0',
      label: data[0].category,
      group: 1,
      color: 'red'
    };
    nodes.push(categoryNode);
  
    const expertSet = new Set();
    data.forEach((item, index) => {
      if (!expertSet.has(item.expert)) {
        expertSet.add(item.expert);
        const expertNode = {
          id: (index + 1).toString(),
          label: item.expert,
          group: 2,
          color: 'blue'
        };
        nodes.push(expertNode);
        links.push({
          source: '0',
          target: (index + 1).toString()
        });
      }
    });
  
    return { nodes, links };
  }