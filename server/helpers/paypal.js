import paypal from "paypal-rest-sdk";

paypal.configure({
  mode: "sandbox",
  client_id:
    "AUze0uCKYTPO3s5pfSj1GF5gUFVNHETKzy5i-YGJ_-MYmJgugLfMkijS88j3kxYB4xlErY_SvzfxVpz_",
  client_server:
    "EPTa9KpKQ5Rc3_8FNw4cTnJuAMFTBGCYvzfZvgppZkx710n4o0RRM0OpP5sswW4cA4aA4GPW89kmpSgj",
});

export default paypal;
