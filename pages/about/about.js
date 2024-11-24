export const Cardclick = document.querySelectorAll(".card");
export const span = document.querySelectorAll(".span");
export const CardclickFun = () => {
  Cardclick.forEach((el) => {
    el.addEventListener("click", () => {
      span.forEach((element) => {
        if (el.id === element.id) {
          element.style.display = "flex";
          // element.style.transition = "1s";
        }else{
          element.style.display = "none";
        }
        // if (el !== element.target) {
        //   el.classList.add("hidden");
        // }
        // if (el.id === element.id) {
        //   element.style.display = "none";
        // }
      });
    });
  });
};
CardclickFun();
export const Clickbtn = () => {
  const next = document.querySelector("#next-btn");
  next.addEventListener("click", () => {
    window.location.href = "../registr or auth/registr-auth.html";
  });
};
Clickbtn();

// export const Presseffect = () =>{
//     setInterval(() => {

//     }, 1000);
// }
