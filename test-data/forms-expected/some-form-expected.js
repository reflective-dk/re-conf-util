(args) => {
  return {
    render: function (view) {
     view.addView({
 type: "header",
 template: "some snippet"
});
    }
  };
};