if (!localStorage.getItem("loggedInUser")) {
    window.location.href = "login.html";
}
//thông tin người dùng đăng nhập giả sử
const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser")) || {
    id: 1,
    name: "Admin"
};
let projects = JSON.parse(localStorage.getItem(`projects_${loggedInUser.id}`)) || []
if (projects.length === 0) {
    projects = [
        { id: 1, name: "Xây dựng website thương mại điện tử", desc: "Dự án nhằm phát triển một nền tảng thương mại điện tử với nhiều tính năng.", ownerId: loggedInUser.id },
        { id: 2, name: "Phát triển ứng dụng di động", desc: "Dự án phát triển ứng dụng di động cho iOS và Android.", ownerId: loggedInUser.id },
        { id: 3, name: "Quản lý dữ liệu khách hàng", desc: "Hệ thống quản lý dữ liệu khách hàng hiệu quả.", ownerId: loggedInUser.id },
        { id: 4, name: "Xây dựng hệ thống ERP", desc: "Dự án xây dựng hệ thống ERP cho doanh nghiệp.", ownerId: loggedInUser.id },
        { id: 5, name: "Ứng dụng đặt xe trực tuyến", desc: "Ứng dụng đặt xe trực tuyến với giao diện thân thiện.", ownerId: loggedInUser.id },
        { id: 6, name: "Phần mềm quản lý nhân sự", desc: "Phần mềm quản lý nhân sự cho công ty.", ownerId: loggedInUser.id },
        { id: 7, name: "Dự án trí tuệ nhân tạo", desc: "Dự án phát triển AI cho doanh nghiệp.", ownerId: loggedInUser.id },
        { id: 8, name: "Ứng dụng thương mại điện tử", desc: "Ứng dụng thương mại điện tử với nhiều tính năng.", ownerId: loggedInUser.id },
        { id: 9, name: "Phần mềm kế toán doanh nghiệp", desc: "Phần mềm kế toán cho doanh nghiệp vừa và nhỏ.", ownerId: loggedInUser.id },
        { id: 10, name: "Hệ thống quản lý học sinh", desc: "Hệ thống quản lý học sinh cho trường học.", ownerId: loggedInUser.id }
    ];
    localStorage.setItem(`projects_${loggedInUser.id}`, JSON.stringify(projects))
}

document.getElementById("addProjectBtn").addEventListener("click", function() {
    document.getElementById("projectModal").style.display = "flex";
})
document.getElementById("saveProjectBtn").addEventListener("click", saveProject);
document.getElementById("confirmDelete").addEventListener("click", deleteProject);
document.getElementById("cancelDelete").addEventListener("click", closeDeleteModal)
document.getElementById("logoutBtn").addEventListener("click", function(event){
    event.preventDefault();
    logout()
});
let currentPage=1
let numPage=5

function renderTable(showProjects){
    let tableBody= document.getElementById("projectTable")
    let start= (currentPage-1)*numPage
    let end= start+numPage
    let element= ""

    for(let i=start; i<end && i<showProjects.length; i++){
        let project=showProjects[i]
        element += "<tr>" +
            "<td class='id'>" + project.id + "</td>" +
            "<td class='name'>" + project.name + "</td>" +
            "<td class='action'>" +
                "<button class='btn btn-warning btn-sm' onclick='editProject(" + project.id + ")'>Sửa</button>" +
                "<button class='btn btn-danger btn-sm' onclick='confirmDelete(" + project.id + ")'>Xóa</button>" +
                "<button class='btn btn-primary btn-sm' onclick='viewDetails(" + project.id + ")'>Chi tiết</button>" +
            "</td>" +
        "</tr>"
    }
    tableBody.innerHTML=element
    renderPagination(showProjects)
}


document.getElementById("addProjectBtn").addEventListener("click", function() {
    document.getElementById("projectModal").style.display = "flex";
    document.getElementById("projectNameError").innerHTML = "";
    document.getElementById("projectDescError").innerHTML = "";
});
document.getElementById("projectName").addEventListener("input", function() {
    document.getElementById("projectNameError").innerHTML = ""
})
document.getElementById("projectDesc").addEventListener("input", function() {
    document.getElementById("projectDescError").innerHTML = ""
})

function saveProject() {
    let projectId= document.getElementById("projectId").value
    let projectName= document.getElementById("projectName").value.trim().toLowerCase()
    let projectDesc= document.getElementById("projectDesc").value.trim()
    let nameError= document.getElementById("projectNameError")
    let descError= document.getElementById("projectDescError")

    nameError.innerHTML= ""
    descError.innerHTML= ""

    let checkError=false
    if(projectName===""){
        nameError.innerHTML= "Tên dự án không được để trống!"
        checkError=true
    } else if(projectName.length<3 || projectName.length>50){
        nameError.innerHTML= "Tên dự án phải từ 3 đến 50 ký tự!"
        checkError=true
    }
    for(let i=0; i<projects.length; i++){
        if(projects[i].ownerId===loggedInUser.id){
            if(projects[i].name.toLowerCase()===projectName && projects[i].id!=Number(projectId)){
                nameError.innerHTML= "Tên dự án đã tồn tại!"
                checkError=true
                break
            }

        }
    }
    if(projectDesc===""){
        descError.innerHTML= "Mô tả không được để trống!"
        checkError=true
    } else if(projectDesc.length<10 || projectDesc.length>500) {
        descError.innerHTML= "Mô tả phải từ 10 đến 500 ký tự!"
        checkError=true
    }
    if(checkError){
        return
    }
    projectName= projectName.charAt(0).toUpperCase() + projectName.slice(1)
    if(projectId===""){
        let newId=1
        for(let i=0; i<projects.length; i++){
            if(projects[i].id>=newId){
                newId=projects[i].id+1
            }
        }
        projects.push({
            id: newId,
            name: projectName,
            desc: projectDesc,
            ownerId: loggedInUser.id
        })
    }else {
        for(let i=0; i<projects.length; i++){
            if(projects[i].id=== Number(projectId)){
                projects[i].name=projectName;
                projects[i].desc=projectDesc
                break;
            }
        }
    }
    localStorage.setItem(`projects_${loggedInUser.id}`, JSON.stringify(projects))
    renderProjects()
    closeModal()
}

function editProject(id){
    for(let i=0; i<projects.length; i++){
        if(projects[i].id===id){
            document.getElementById("projectId").value= id;
            document.getElementById("projectName").value= projects[i].name
            document.getElementById("projectDesc").value= projects[i].desc
            document.getElementById("modalTitle").innerHTML= "Thêm/sửa dự án"
            document.getElementById("projectModal").style.display= "flex"
            break;
        }
    }
}
function closeModal(){
    document.getElementById("projectModal").style.display= "none"
    document.getElementById("projectId").value= "";
    document.getElementById("projectName").value= "";
    document.getElementById("projectDesc").value= "";
    document.getElementById("projectNameError").innerHTML= ""
    document.getElementById("projectDescError").innerHTML= ""
    document.getElementById("modalTitle").innerHTML= "Thêm Dự Án";
}
function confirmDelete(id){
    const deleteModal= document.getElementById("deleteModal") 
    deleteModal.style.display= "flex"
    deleteModal.setAttribute("data-id", id) 
}  
function closeDeleteModal(){
    document.getElementById("deleteModal").style.display = "none"
}
function deleteProject(){
    let idToDelete = Number(document.getElementById("deleteModal").getAttribute("data-id"))
    let newProject=[]
    for(let i=0; i<projects.length; i++){
        if(projects[i].id!==idToDelete){
            newProject.push(projects[i])
        }
    }
    projects=newProject
    localStorage.setItem(`projects_${loggedInUser.id}`, JSON.stringify(projects))
    renderProjects()
    closeDeleteModal()
}

// tìm kiếm bằng Enter
document.getElementById("searchInput").addEventListener("keydown", function(event) {  
    if (event.key === "Enter") {  
    let search = document.getElementById("searchInput").value.toLowerCase()
    let finding = []  
    for (let i=0; i<projects.length; i++) {  
        let project = projects[i] 
        if(project.ownerId===loggedInUser.id){  
            if(project.name.toLowerCase().indexOf(search)!==-1 || project.desc.toLowerCase().indexOf(search)!==-1) {  
                finding.push(project);  
            }  
        }  
    }  
    
    currentPage = 1;  
    renderSearchProjects(finding);  
}  
})
function renderProjects(){
    let allProjects=[]
    for(let i=0; i<projects.length; i++){
        if(projects[i].ownerId===loggedInUser.id){
            allProjects.push(projects[i])
        }
    }
    renderTable(allProjects)
}
function renderSearchProjects(finding){
    renderTable(finding);
}

function renderPagination(showProjects){
    let totalPage= Math.ceil(showProjects.length/numPage)
    let pagination= document.getElementById("pagination")
    let element= ""

    if(currentPage===1){
        element+= "<button class='nav-btn disabled'><</button>"
    }else {
        element+= "<button class='nav-btn' onclick='prevPage()'><</button>"
    }
    for(let i=1; i<=totalPage; i++){
        if(i===currentPage){
            element+= "<button class='active'>" + i + "</button>"
        }else {
            element+= "<button onclick='changePage(" + i + ")'>" + i + "</button>"
        }
    }
    if(currentPage===totalPage){
        element+= "<button class='nav-btn disabled'>></button>"
    } else{
        element+= "<button class='nav-btn' onclick='nextPage()'>></button>"
    }
    pagination.innerHTML=element
}
function changePage(page){
    currentPage=page
    renderProjects()
}
function prevPage(){
    if(currentPage>1){
        currentPage--
        renderProjects()
    }
}
function nextPage(){
    let totalProject= 0
    for(let i=0; i<projects.length; i++){
        if(projects[i].ownerId===loggedInUser.id){
            totalProject++
        }
    }
    let totalPage= Math.ceil(totalProject/numPage)
    if(currentPage<totalPage){
        currentPage++
        renderProjects()
    }
}

function viewDetails(id){
    window.location.href= "project-details.html?id=" + id
}
function logout(){
    localStorage.removeItem("loggedInUser")
    window.location.href= "login.html"
}

renderProjects()
