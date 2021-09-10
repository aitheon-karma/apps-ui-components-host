export const socketIoMessages = {
  connect_error: 'connect_error',
  ui_controls: 'ui-controls',
  update_value: 'update-value',
  ui_control: 'ui-control',
  ui_replay_state: 'ui-replay-state',
  disconnect: 'disconnect',
};

export const socketActions = (() => {
  const result = {};

  Object.entries(socketIoMessages).forEach(([key, value]) => {
    result[key] = `socket__${value}`
  });

  return result;
})();
