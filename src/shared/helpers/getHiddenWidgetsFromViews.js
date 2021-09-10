export const getHiddenWidgetsFromViews = views => {
  if (!views?.length) {
    return [];
  }
  return views.reduce((result, view) => {
    const viewHiddenWidgets = view.hidden ? view.hidden : [];
    return [
      ...result,
      ...viewHiddenWidgets,
    ];
  }, []);
};
