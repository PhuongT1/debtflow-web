document.addEventListener('click', (event) => {
  const button = event.target.closest('button[data-action]');
  if (button && !button.disabled)
    document.querySelector('#result').textContent = button.dataset.action;
});
