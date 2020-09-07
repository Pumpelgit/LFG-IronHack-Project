function updateProfileUsername() {
  const userName = document.getElementById("usernamefixed").value
  const formData = new FormData()
  formData.append("username", userName)
  axios
    .post(`/update/username/` || "http://localhost:3000/update/username",formData)
    .then((res) => {
      document.getElementById("username").innerText = res.data.user.username
      lfgButtonSetter()
    })
    .catch(console.error)
}

function updateProfileDescription() {
  const description = document.getElementById("descriptionfixed").value
  const formData = new FormData()
  formData.append("description", description)
  axios
    .post(`/update/description/` || "http://localhost:3000/update/description",formData)
    .then((res) => {
      document.getElementById("description").innerText = res.data.user.description
      lfgButtonSetter()
    })
    .catch(console.error)
}

function updateProfileAvatar() {
  const picture = document.getElementById("avatarFixed")
  const formData = new FormData()
  formData.append("avatar", picture.files[0])
  axios
  .post(`/update/avatar/` || "http://localhost:3000/update/avatar",formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  })
    .then((res) => {
      document.getElementById("avatar").src = res.data.user.avatar
      lfgButtonSetter()
    })
    .catch(console.error)
}

function updateProfileBirthDate() {
  const birthdate = document.getElementById("birthdatefixed").value
  const formData = new FormData()
  formData.append("birthdate", birthdate)
  axios
    .post(`/update/birthdate/` || "http://localhost:3000/update/birthdate",formData)
    .then((res) => {
      const format = (s) => (s < 10) ? '0' + s : s
      const myDate = new Date(res.data.user.birthdate)
      document.getElementById("birthdate").innerText = [format(myDate.getDate()), format(myDate.getMonth() + 1), myDate.getFullYear()].join('/')
      lfgButtonSetter()
    })
    .catch(console.error)
}

function updateProfileGender() {
  const gender = document.getElementById("genderfixed").value
  const formData = new FormData()
  formData.append("gender", gender)
  axios
    .post(`/update/gender/` || "http://localhost:3000/update/gender",formData)
    .then((res) => {
      document.getElementById("gender").innerText = res.data.user.gender
      lfgButtonSetter()
    })
    .catch(console.error)
}

function updateProfileLang() {
  const language = Array.from(document.getElementById("languagefixed").selectedOptions).map(x=> {return x.value})
  const formData = new FormData()
  language.forEach(element =>{formData.append("language[]", element)})

  axios
    .post(`/update/language/` || "http://localhost:3000/update/language",formData)
    .then((res) => {
      const text = `| ${res.data.user.language.reduce((acc,curr) => {
        return `${acc} | ${curr}`
      })} |`
      document.getElementById("language").innerText = text
      lfgButtonSetter()
    })
    .catch(console.error)
}

function updateProfileRegion() {
  const region = document.getElementById("regionfixed").value
  const formData = new FormData()
  formData.append("region", region)
  axios
    .post(`/update/region/` || "http://localhost:3000/update/region",formData)
    .then((res) => {
      document.getElementById("region").innerText = res.data.user.region
      lfgButtonSetter()
    })
    .catch(console.error)
}

function updateProfileGameTag(service) {
  const gameService = {};
  gameService[service.id] = document.getElementById(`${service.id}fixed`).value
  const formData = new FormData()
  formData.append("gameTags", JSON.stringify(gameService))
  updateProfileField('gameTag',formData,service.id,gameService[service.id])
  /*axios
    .post(`/update/gameTag/` || "http://localhost:3000/update/gameTag",formData)
    .then((res) => {
      document.getElementById(`${service.id}`).innerText = res.data.user.gameTags[service.id]
      lfgButtonSetter()
    })
    .catch(console.error)*/
}

function updateProfileField(field,form,elementId,value){
  axios
  .post(`/update/${field}/` || `http://localhost:3000/update/${field}`,form)
  .then((res) => {
    document.getElementById(`${elementId}`).innerText = value
    lfgButtonSetter()
  })
  .catch(console.error)
}

function lfgButtonSetter() {
  const lfgButton = document.getElementById("lfg")
  if(res.data.user.activation.profileFinished){
    lfgButton.classList.remove('disabled')
  } else {
    lfgButton.classList.add('disabled')
  }
}
