const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const id = urlParams.get('id');
const email = urlParams.get('email');
const displayName = urlParams.get('displayName');
const token = urlParams.get('token');
const role = urlParams.get('role');
const is_banned = urlParams.get('is_banned');
const emailconfirmed = urlParams.get('emailconfirmed');
const cart_id = urlParams.get('cart_id');

if (id && email && displayName && token && role && is_banned && emailconfirmed && cart_id) {
    localStorage.setItem('token', token);
    localStorage.setItem('role', role);
    localStorage.setItem('isBanned', is_banned);
    localStorage.setItem('email', email);
    localStorage.setItem('emailConfirmed', emailconfirmed);
    localStorage.setItem('cart_id', cart_id);
}
