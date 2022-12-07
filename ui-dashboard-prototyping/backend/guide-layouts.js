const layouts = [
  {
    id: "simple-banner",
    title: "Simple banner",
    defaultElement: "div",
    defaultStyle: {
      position: "relative",
      width: "200px",
      height: "50px",
      boxShadow: "2px 2px 5px 0px rgba(0,0,0,0.2)",
      padding: "8px",
    },
    children: [
      {
        defaultElement: "span",
        children: ["&times;"],
        actions: [
          {
            type: "close",
            eventType: "click",
            params: ["foo", "bar"],
          },
        ],
        defaultStyle: {
          position: "absolute",
          right: "0",
          marginRight: "8px",
          fontSize: "1.5em",
          cursor: "pointer",
        },
      },
    ],
  },
];

const getLayoutById = (layoutId) => {
  return layouts.find(({ id }) => id === layoutId);
};

module.exports.getLayoutById = getLayoutById;
module.exports.layouts = layouts;
