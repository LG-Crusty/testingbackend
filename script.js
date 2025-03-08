               
                     // same file for singup, login and main todo html

// same dom manipulation, data is pushed to backend through axios(which is an asynchronous operation) 

// for signup page
try {   
document.querySelector("#sgbutton").addEventListener("click",
   async () => {
      let username = document.querySelector("#sg-ip1").value
      let email = document.querySelector("#sg-ip2").value
      let password = document.querySelector("#sg-ip3").value
             
            if (username == "" || email == "" || password == "" ) {
               alert("input fields are empty")
            }
            const signupValue = await axios.post("http://localhost:3000/singup", (
               {
                  "username": username,
                  "email": email,
                  "password": password
               }
            )
         )
            
              
      const signUp = signupValue.data.done

      if (signUp) {
       window.location.href = "logIn.html"
          }
          else{
             alert( signupValue.message)
          }
   })

//  response handling for signup where it redirects to other page

// for the login page

document.querySelector("#lgbtn").addEventListener("click", async () => {

   let username = document.querySelector("#lgip1").value
   let password = document.querySelector("#lgip2").value

   await axios.post("localhost:3000/login", (
      {
         "username": username,
         "password": password
      }

   )

   )
   //   token catching at the point and save it to the local storage 
   // and fetch it everytime for the future operation 

   let token = await axios.post("localhost:3000/login")
   let realtoken = token.data.token

   //  use document instead windows
   //  window.localStorage.setItem("acesstoken",realtoken)
   Cookies.set('acesstoken', realtoken)
}
);

//  for the main todo page 


document.querySelector("#button").addEventListener("click", async () => {
   let task = document.querySelector("#input").value
   if (task === "") {
      alert("task is empty")
   }
   let token = Cookies.get("acesstoken");

   //   always send the token that is give to user in the header
   //  fetch token from the localstorage where that is saved

   await axios.post("localhost:3000/todo",
      (
         {
            header: {
               "token": token

            }
         },

         { todo: task }
      )

   )
   const neededtodo = await axios.post("localhost:3000/todo")
   let aptask = neededtodo.data.task

   // appending task into the div
   let spanEl = document.createElement("span")
   spanEl.setAttribute("id", "todo-span")
   //  use spanEl

   //  task is received from the database
   span.innerHTML = aptask


   let checkbox = document.createElement("input")
   checkbox.setAttribute('type', "checkbox")
   checkbox.setAttribute("id", "todo-check")

   checkbox.addEventListener("change", () => {
      span.style.textDecoration = "underline"
   })

   let del = document.createElement("button")
   del.setAttribute("id", "todo-del")

   del.addEventListener("click", async () => {
      //  fetch token from the local storage
      let token = Cookies.get("acesstoken")

      let mainDel = del.closest("span").textContent
      await axios.post("localhost:3000/delete", (
         {
            headers: {
               "token": token
            }

         },

         {
            "task": mainDel
         }
      )
      )

   })
   // creating edit and add functionlaity 
   let edit = document.createElement("button")
   edit.setAttribute("id", "todo-edit")

   edit.addEventListener("click",
      async () => {
         let token = Cookies.get("acesstoken")
         let neededTask = edit.closest("span").textContent


         await axios.post("localhost:3000/edit",
            {
               headers: {
                  "token": token
               }
            },
            {
               "data": {
                  "task": neededTask

               }
            }
         )

         // after backend will process the request

         let rtask = await axios.get("localhost:3000/update")
         let edittask = rtask.data.task

         document.querySelector("#input").innerHTML = edittask

         //  if res is done then append the task in the div

         document.querySelector("#display").append(span, checkbox, del, edit);
      }
   )

},





)} catch (error) {
   
}