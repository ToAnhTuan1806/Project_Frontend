document.getElementById("register-form").onsubmit = function(event) {
    event.preventDefault();

    let email = document.getElementById("email").value.trim()
    let password = document.getElementById("password").value.trim()
    let errorEmail = document.getElementById("error-email")
    let errorEmailFormat = document.getElementById("error-format")
    let errorPassword = document.getElementById("error-password")

    errorEmail.style.display="none"
    errorEmailFormat.style.display="none"
    errorPassword.style.display="none"

    let checkInfo = true;
    if(email===""){
        errorEmail.style.display ="block"
        document.getElementById("email").classList.add("error-input")
        checkInfo= false
    } else if(!email.includes("@") || !(email.endsWith(".com") || email.endsWith(".vn") || email.endsWith(".net"))) {  
        errorEmailFormat.style.display ="block"  
        document.getElementById("email").classList.add("error-input")
        checkInfo = false  
    }  
    if(password===""){
        errorPassword.style.display ="block"
        document.getElementById("password").classList.add("error-input")
        checkInfo= false
    }

    if (checkInfo) {  
        let users = JSON.parse(localStorage.getItem("users")) || []
        let foundUser = users.find(function(user) {
            return user.email === email && user.password === password
        })


        if (foundUser) {
            localStorage.setItem("loggedInUser", JSON.stringify(foundUser))
            Swal.fire({
                title: "Đăng nhập thành công!",
                icon: "success",
                draggable: true,
                timer: 1500,
                timerProgressBar: true, 
                showConfirmButton: false,
                position: "top"
                
              });
              setTimeout(function() {
                window.location.href = "project-management.html";
            }, 1500);
        } else {  
            errorPassword.innerText ="Email hoặc mật khẩu không đúng."  
            errorPassword.style.display = "block";
            document.getElementById("password").classList.add("error-input")
            document.getElementById("email").classList.add("error-input")

        }  
    }  
}
let inputElement=[
    {el: document.getElementById("email"), error: "error-email" },
    {el: document.getElementById("email"), error: "error-format" },
    {el: document.getElementById("password"), error: "error-password" }
]
inputElement.forEach(function(input){
    input.el.addEventListener("input", function(){
        document.getElementById(input.error).style.display="none"
        input.el.classList.remove("error-input")
    })
})