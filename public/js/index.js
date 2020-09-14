function updateProfileUsername() {
  const userName = document.getElementById("usernamefixed").value
  const formData = new FormData()
  formData.append("username", userName)
  updateProfileField("username", formData, "username", userName)
}

function updateProfileDescription() {
  const description = document.getElementById("descriptionfixed").value
  const formData = new FormData()
  formData.append("description", description)
  updateProfileField("description", formData, "description", description)
}

function updateProfileAvatar() {
  const picture = document.getElementById("avatarFixed")
  const formData = new FormData()
  formData.append("avatar", picture.files[0])
  axios
    .post(
      `/update/avatar/` || "http://localhost:3000/update/avatar",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    )
    .then((res) => {
      document.getElementById("avatar").src = res.data.user.avatar
      lfgButtonSetter(res)
    })
    .catch(console.error)
}

function updateProfileBirthDate() {
  const birthdate = document.getElementById("birthdatefixed").value
  const formData = new FormData()
  formData.append("birthdate", birthdate)
  const format = (s) => (s < 10 ? "0" + s : s)
  const myDate = new Date(birthdate)
  const formatedDate = [
    format(myDate.getDate()),
    format(myDate.getMonth() + 1),
    myDate.getFullYear(),
  ].join("/")
  updateProfileField("birthdate", formData, "birthdate", formatedDate)
}

function updateProfileGender() {
  const gender = document.getElementById("genderfixed").value
  const formData = new FormData()
  formData.append("gender", gender)
  updateProfileField("gender",formData,"gender",gender)  
}

function updateProfileLang() {
  const language = Array.from(
    document.getElementById("languagefixed").selectedOptions
  ).map((x) => {
    return x.value
  })
  const formData = new FormData()
  language.forEach((element) => {
    formData.append("language[]", element)
  })
  const text = `| ${language.reduce((acc, curr) => {
    return `${acc} | ${curr}`
  })} |`
  updateProfileField("language",formData,"language",text)
  
}

function updateProfileRegion() {
  const region = document.getElementById("regionfixed").value
  const formData = new FormData()
  formData.append("region", region)

  updateProfileField("region",formData,"region",region)
}

function updateProfileGameTag(service) {
  const gameService = {}
  gameService[service.id] = document.getElementById(`${service.id}fixed`).value
  const formData = new FormData()
  formData.append("gameTags", JSON.stringify(gameService))
  updateProfileField("gameTag", formData, service.id, gameService[service.id])
}

function updateProfileGames() {
  const game = Array.from(
    document.getElementById("gamesfixed").selectedOptions
  ).map((x) => {
    return x.value
  })
  const formData = new FormData()
  game.forEach((element) => {
    formData.append("games[]", element)
  })
  const text = `| ${game.reduce((acc, curr) => {
    return `${acc} | ${curr}`
  })} |`
  updateProfileField("games",formData,"games",text)
}  

function updateProfileField(field, form, elementId, value) {
  axios
    .post(`/update/${field}/` || `http://localhost:3000/update/${field}`, form)
    .then((res) => {
      document.getElementById(`${elementId}`).innerText = value
      lfgButtonSetter(res)
    })
    .catch(console.error)
}

function lfgButtonSetter(res) {
  const lfgButton = document.getElementById("lfg")
  if (res.data.user.activation.profileFinished) {
    lfgButton.classList.remove("disabled")
  } else {
    lfgButton.classList.add("disabled")
  }
}

function onPreferenceOptionSelected(e, id) {
  const optionSelected = e.currentTarget
  const selectedGamesElement = document.getElementById(id.id)
  const createdButton = document.createElement("button")
  const hiddenInputFiled = document.createElement("input")
  if (document.getElementById(optionSelected.value) === null) {
    hiddenInputFiled.name = `${id.id}Form`
    hiddenInputFiled.id = optionSelected.value
    hiddenInputFiled.value = optionSelected.value
    hiddenInputFiled.type = "hidden"
    createdButton.classList.add("badge", "badge-primary")
    createdButton.innerText = `${optionSelected.value}`
    createdButton.onclick = onClickDestroyButton
    selectedGamesElement.appendChild(hiddenInputFiled)
    selectedGamesElement.appendChild(createdButton)
  }
  optionSelected.value = ""
}

function onClickDestroyButton(e) {
  const gameToRemove = e.currentTarget
  gameToRemove.remove()
}
