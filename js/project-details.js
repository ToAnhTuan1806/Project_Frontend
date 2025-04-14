if (!localStorage.getItem("loggedInUser")) {
    window.location.href = "login.html";
}
let loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"))

let urlParams = new URLSearchParams(window.location.search)
let projectId = parseInt(urlParams.get("id")) || 1;

let projects = JSON.parse(localStorage.getItem(`projects_${loggedInUser.id}`)) || [];
let tasks = JSON.parse(localStorage.getItem(`tasks_${projectId}`)) || [
    { id: 1, name: "Soạn thảo đề cương dự án", assignee: "Tuấn Tô", priority: "low", startDate: "2025-04-14", deadline: "2025-04-27", status: "green", category: "To do", projectId: 1 },
    { id: 2, name: "Soạn thảo đề cương dự án", assignee: "Tuấn Tô", priority: "medium", startDate: "2025-04-14", deadline: "2025-04-27", status: "yellow", category: "To do", projectId: 1 },
    { id: 3, name: "Soạn thảo đề cương dự án", assignee: "Tuấn Tô", priority: "high", startDate: "2025-04-14", deadline: "2025-04-27", status: "red", category: "To do", projectId: 1 },
    { id: 4, name: "Kiểm tra tính năng giỏ hàng", assignee: "Tuấn Tô", priority: "medium", startDate: "2025-04-14", deadline: "2025-04-27", status: "yellow", category: "In Progress", projectId: 1 }
]
let projectFound= false
let project= {}
for (let i = 0; i<projects.length; i++) {
    if(projects[i].id=== projectId) {
        project= projects[i];
        projectFound= true
        break;
    }
}
if (!projectFound) {
    alert("Dự án không tồn tại!");
    window.location.href = "project-management.html";
}


function showProjectDetails(){
    let projectName= document.getElementById("projectName")
    let projectDesc= document.getElementById("projectDesc")
    projectName.innerHTML= project.name
    projectDesc.innerHTML= project.desc
}

function renderTasks() {
    let categories = ["To do", "In Progress", "Pending", "Done"];
    if (tasks.length === 0) {
        console.log("Không có nhiệm vụ!");
        return;
    }
    for (let i = 0; i < categories.length; i++) {
        let category = categories[i];
        let subTableId = "sub" + category.replace(" ", "")
        let subTable = document.getElementById(subTableId)
        subTable.innerHTML =""
        for (let j = 0; j < tasks.length; j++) {
            if (tasks[j].projectId === projectId && tasks[j].category === category){ 
                let task = tasks[j];
                let priorityText= ""
                if(task.priority==="low"){
                    priorityText="Thấp"
                }else if(task.priority==="medium"){
                    priorityText="Trung bình"
                }else {
                    priorityText="Cao"
                }
                
                let statusText= ""
                if(task.status==="green"){
                    statusText="Đúng tiến độ"
                }else if(task.status==="yellow"){
                    statusText="Có rủi ro"
                }else if(task.status==="red"){
                    statusText="Trễ hạn"
                }else{
                    statusText="Chưa bắt đầu"
                }
                
                // cắt chuỗi để có định dạng MM-DD
                const startDate = `<span class="colorText">${task.startDate.slice(5, 7)}</span> <span class="colorText">-</span> <span class="colorText">${task.startDate.slice(8, 10)}</span>`
                const deadline = `<span class="colorText">${task.deadline.slice(5, 7)}</span> <span class="colorText">-</span> <span class="colorText">${task.deadline.slice(8, 10)}</span>`
                subTable.innerHTML += `
                <tr>
                <td>${task.name}</td>
                <td>${task.assignee}</td>
                <td><span class="priority ${task.priority}">${priorityText}</span></td>
                <td>${startDate}</td>
                <td>${deadline}</td>
                <td><span class="status ${task.status}">${statusText}</span></td>
                <td>
                <button class="btn-edit" onclick="editTask(${task.id})">Sửa</button>
                <button class="btn-delete" onclick="openDeleteModal(${task.id})">Xóa</button>
                </td>
                </tr>
                `;
            }
        }
    }
}

//thêm nhiệm vụ 
function openTaskModal(){
    let modal= document.getElementById("taskModal")
    let title= document.getElementById("taskModalTitle")
    let form= document.getElementById("taskForm")
    modal.style.display= "flex"
    title.innerHTML= "Thêm nhiệm vụ"
    form.reset();
    form.removeAttribute("data-taskId")
}
function closeTaskModal(){
    document.getElementById("taskModal").style.display= "none"
}


function addMission(event){
    event.preventDefault();
    let taskId= document.getElementById("taskForm").getAttribute("data-taskId")
    let name= document.getElementById("taskName").value.trim()
    let assignee= document.getElementById("assignee").value.trim()
    let taskStatus= document.getElementById("taskStatus").value
    let startDate= document.getElementById("startDate").value
    let deadline= document.getElementById("deadline").value
    let priority= document.getElementById("priority").value
    let progress= document.getElementById("progress").value

    let errorTaskName = document.getElementById("error-taskName")
    let errorAssignee = document.getElementById("error-assignee")
    let errorTaskStatus= document.getElementById("error-taskStatus")
    let errorStartDate = document.getElementById("error-startDate")
    let errorDeadline = document.getElementById("error-deadline")
    let errorPriority= document.getElementById("error-priority")
    let errorProgress= document.getElementById("error-progress")

    errorTaskName.innerHTML=""
    errorAssignee.innerHTML=""
    errorTaskStatus.innerHTML=""
    errorStartDate.innerHTML=""
    errorDeadline.innerHTML=""
    errorPriority.innerHTML=""
    errorProgress.innerHTML=""
    
    document.getElementById("taskName").classList.remove("input-error")
    document.getElementById("assignee").classList.remove("input-error")
    document.getElementById("taskStatus").classList.remove("input-error")
    document.getElementById("startDate").classList.remove("input-error")
    document.getElementById("deadline").classList.remove("input-error")
    document.getElementById("priority").classList.remove("input-error")
    document.getElementById("progress").classList.remove("input-error")

    let checkError = true
    if(name==="") {
        errorTaskName.innerHTML= "Tên nhiệm vụ không được để trống!"
        document.getElementById("taskName").classList.add("input-error")
        checkError= false
    } else  if ((name.length<3 || name.length>50)) {
        errorTaskName.innerHTML= "Tên nhiệm vụ phải từ 3 đến 50 ký tự!"
        document.getElementById("taskName").classList.add("input-error")
        checkError= false
    } else {
        let duplication
        for(let i=0; i<tasks.length; i++) {
            if (tasks[i].projectId===projectId && tasks[i].name.toLowerCase()===name.toLowerCase() && tasks[i].id!==parseInt(taskId)) {
                duplication=true
                break         
            }
        }
        if(duplication){
            errorTaskName.innerHTML= "Tên nhiệm vụ đã tồn tại!"
            document.getElementById("taskName").classList.add("input-error")
            checkError=false
        }
    }

    if(assignee===""){
        errorAssignee.innerHTML= "Vui lòng chọn người phụ trách!"
        document.getElementById("assignee").classList.add("input-error")
        checkError= false
    }
    if(taskStatus===""){
        errorTaskStatus.innerHTML= "Vui lòng chọn trạng thái nhiệm vụ!"
        document.getElementById("taskStatus").classList.add("input-error")
        checkError=false
    }

    let today= new Date().toISOString().split("T")[0]
    if(startDate===""){
        errorStartDate.innerHTML= "Ngày bắt đầu không được để trống!"
        document.getElementById("startDate").classList.add("input-error")
        checkError= false
    } else if(startDate<= today){
        errorStartDate.innerHTML= "Ngày bắt đầu phải lớn hơn ngày hiện tại!"
        document.getElementById("startDate").classList.add("input-error")
        checkError= false
    }
    if(deadline===""){
        errorDeadline.innerHTML= "Hạn chót không được để trống!"
        document.getElementById("deadline").classList.add("input-error")
        checkError= false
    } else if(deadline<= startDate){
        errorDeadline.innerHTML= "Hạn chót phải lớn hơn ngày bắt đầu!"
        document.getElementById("deadline").classList.add("input-error")
        checkError= false
    }

    if(priority===""){
        errorPriority.innerHTML= "Vui lòng chọn độ ưu tiên!"
        document.getElementById("priority").classList.add("input-error")
        checkError= false
    }
    
    if(progress===""){
        errorProgress.innerHTML= "Vui lòng chọn tiến độ!"
        document.getElementById("progress").classList.add("input-error")
        checkError= false
    }


    if (!checkError) {
        return
    }

    let category= taskStatus
    if(category===""){
        category= "To do"
    }
    let id
    if(taskId){
        id= parseInt(taskId)
    }else{
        if(tasks.length>0){
            let maxId= tasks[0].id
            for(let i=0; i<tasks.length; i++){
                if(tasks[i].id>maxId){
                    maxId=tasks[i].id
                }
            }
            id=maxId+1
        } else{
            id=1
        }
    }
    let newTask={
        id: id,
        projectId: projectId,
        name: name,
        assignee: assignee,
        priority: priority,
        startDate: startDate,
        deadline: deadline,
        status: progress,
        category: category
    }
    if(taskId){
        for(let i=0; i<tasks.length; i++){
            if(tasks[i].id===parseInt(taskId)){
                tasks[i]=newTask
                break
            }
        }
    }else {
        tasks.push(newTask)
    }
    localStorage.setItem(`tasks_${projectId}`, JSON.stringify(tasks))
    renderTasks()
    document.getElementById("taskForm").reset()
    document.getElementById("taskForm").removeAttribute("data-taskId")
    document.getElementById("taskModal").style.display = "none"
}

//sửa nhiệm vụ
function editTask(taskId){
    let taskFound= false
    let task= {}
    for(let i=0; i<tasks.length; i++){
        if(tasks[i].id===taskId){
            task=tasks[i]
            taskFound=true
            break
        }
    }
    if(!taskFound){
        return
    }
    
    let modal= document.getElementById("taskModal")
    let title= document.getElementById("taskModalTitle")
    modal.style.display= "flex"
    title.innerHTML= "Sửa nhiệm vụ"
    
    document.getElementById("taskName").value= task.name
    document.getElementById("assignee").value= task.assignee
    document.getElementById("taskStatus").value= task.category
    document.getElementById("startDate").value= task.startDate
    document.getElementById("deadline").value= task.deadline
    document.getElementById("priority").value= task.priority
    document.getElementById("progress").value= task.status
    document.getElementById("taskForm").setAttribute("data-taskId", taskId)
    
}

//xoá nhiệm vụ 
let taskIdDelete=0
function openDeleteModal(taskId){
    taskIdDelete=taskId
    document.getElementById("deleteModal").style.display= "flex"
}
function closeDeleteModal(){
    document.getElementById("deleteModal").style.display= "none"
}
function confirmDelete(){
    let newTasks=[]
    for(let i=0; i<tasks.length; i++){
        if(tasks[i].id!==taskIdDelete){
            newTasks.push(tasks[i])
        }
    }
    tasks=newTasks
    localStorage.setItem(`tasks_${projectId}`, JSON.stringify(tasks))
    renderTasks()
    document.getElementById("deleteModal").style.display= "none"
}


document.getElementById("addMissionBtn").addEventListener("click", openTaskModal);
document.getElementById("cancelTaskBtn").addEventListener("click", closeTaskModal);
document.getElementById("taskForm").addEventListener("submit", addMission);
document.getElementById("cancelDelete").addEventListener("click", closeDeleteModal);
document.getElementById("confirmDelete").addEventListener("click", confirmDelete);



showProjectDetails()
renderTasks()