const orderId = localStorage.getItem("orderId");
const orderDom = document.getElementById("orderId").textContent=orderId;
localStorage.removeItem("orderId");