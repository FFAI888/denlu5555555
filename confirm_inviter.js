document.getElementById('confirm-bind').addEventListener('click', function() {
  const inviterAddress = '0x1234567890abcdef1234567890abcdef12345678';
  localStorage.setItem('inviterAddress', inviterAddress);
  window.location.href = 'login.html';
});
