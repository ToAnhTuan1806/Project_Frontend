document.getElementById("register-form").onsubmit = function(event) {
    event.preventDefault();

    let fullname = document.getElementById("fullname").value.trim()
    let email = document.getElementById("email").value.trim()
    let password = document.getElementById("password").value.trim()
    let confirmPassword = document.getElementById("confirm-password").value.trim()

    let errorFullname = document.getElementById("error-fullname")
    let errorEmail = document.getElementById("error-email")
    let errorEmailFormat = document.getElementById("error-format")
    let errorEmailDuplication = document.getElementById("error-duplication")
    let errorPassword = document.getElementById("error-password")
    let errorPasswordLength = document.getElementById("error-length")
    let errorConfirmPassword = document.getElementById("error-confirm-password")
    let errorConfirmMismatch = document.getElementById("error-confirm-mismatch")

    errorFullname.style.display = "none";
    errorEmail.style.display = "none"
    errorEmailFormat.style.display = "none"
    errorEmailDuplication.style.display = "none";
    errorPassword.style.display = "none"
    errorPasswordLength.style.display = "none"
    errorConfirmPassword.style.display = "none"
    errorConfirmMismatch.style.display = "none"
    
    let checkInfo = true;
    if(fullname===""){
        errorFullname.style.display="block"
        document.getElementById("fullname").classList.add("error-input")
        checkInfo=false
    }
    if(email===""){
        errorEmail.style.display = "block"
        document.getElementById("email").classList.add("error-input")
        checkInfo=false
    } else if(!email.includes("@") || !(email.endsWith(".com") || email.endsWith(".vn") || email.endsWith(".net"))) {
        errorEmailFormat.style.display = "block"
        document.getElementById("email").classList.add("error-input")
        checkInfo=false
    } else {
        let users= JSON.parse(localStorage.getItem("users")) || []
        let emailDuplication= false
        for(let i=0; i<users.length; i++){
            if(users[i].email=== email){
                emailDuplication= true
                break
            }
        }
        if(emailDuplication) {
            errorEmailDuplication.style.display= "block"
            document.getElementById("email").classList.add("error-input")
            checkInfo= false;
        }
    }
    if(password===""){
        errorPassword.style.display = "block"
        document.getElementById("password").classList.add("error-input")
        checkInfo=false;
    } else if(password.length<8){
        errorPasswordLength.style.display = "block"
        document.getElementById("password").classList.add("error-input")
        checkInfo=false;
    }
    if(confirmPassword===""){
        errorConfirmPassword.style.display = "block"
        document.getElementById("confirm-password").classList.add("error-input")
        checkInfo=false;
    } else if(password!==confirmPassword){
        errorConfirmMismatch.style.display = "block";
        document.getElementById("confirm-password").classList.add("error-input")
        checkInfo=false;
    }

    if(!checkInfo){
        return;
    }

    let users = JSON.parse(localStorage.getItem("users")) || [];
    let userId;

    if (users.length > 0) {
        userId = users[users.length - 1].id + 1;
    } else {
        userId = 1;
    }

    
    let user={
        id: userId,
        fullname: fullname,
        email: email,
        password: password,
    }
    users.push(user);
    localStorage.setItem("users", JSON.stringify(users));

    localStorage.setItem("loggedInUser", JSON.stringify(user));
    Swal.fire({
        position: "top",
        icon: "success",
        title: "Đăng kí tài khoản thành công",
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true, 
      });
      setTimeout(function() {
        window.location.href = "project-management.html";
    }, 1500);
}
let inputElement=[
    {el: document.getElementById("fullname"), error: "error-fullname"},
    {el: document.getElementById("email"), error: "error-email"},
    {el: document.getElementById("email"), error: "error-format"},
    {el: document.getElementById("email"), error: "error-duplication"},
    {el: document.getElementById("password"), error: "error-password"},
    {el: document.getElementById("password"), error: "error-length"},
    {el: document.getElementById("confirm-password"), error: "error-confirm-password"},
    {el: document.getElementById("confirm-password"), error: "error-confirm-mismatch"}
]
inputElement.forEach(function(input){
    input.el.addEventListener("input", function(){
        document.getElementById(input.error).style.display="none"
        input.el.classList.remove("error-input")
    })
})