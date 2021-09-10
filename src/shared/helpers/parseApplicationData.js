export const parseApplicationData = data => {
  const { site } = data;
  return {
    isToolbarVisible: site.hideToolbar === 'false',
  };
};
