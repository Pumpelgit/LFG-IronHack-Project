function updateProfileUsername() {
  const userName = document.getElementById("usernamefixed").value
  const formData = new FormData()
  formData.append("username", userName)
  axios
    .post(`/update/username/` || "http://localhost:3000/update/username",formData)
    .then((res) => {
      document.getElementById("username").innerText = res.data.user.username
      const lfgButton = document.getElementById("lfg")
      if(res.data.user.activation.profileFinished){
        lfgButton.classList.remove('disabled')
      } else {
        lfgButton.classList.add('disabled')
      }
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
      const lfgButton = document.getElementById("lfg")
      if(res.data.user.activation.profileFinished){
        lfgButton.removeClass('disabled')
      } else {
        lfgButton.addClass('disabled')
      }
    })
    .catch(console.error)
}

function updateProfileBirthDate() {
  const birthdate = document.getElementById("birthdatefixed").value
  console.log(birthdate);
  const formData = new FormData()
  formData.append("birthdate", birthdate)
  axios
    .post(`/update/birthdate/` || "http://localhost:3000/update/birthdate",formData)
    .then((res) => {
      const format = (s) => (s < 10) ? '0' + s : s
      const myDate = new Date(res.data.user.birthdate)
      document.getElementById("birthdate").innerText = [format(myDate.getDate()), format(myDate.getMonth() + 1), myDate.getFullYear()].join('/')
      const lfgButton = document.getElementById("lfg")
      if(res.data.user.activation.profileFinished){
        lfgButton.classList.remove('disabled')
      } else {
        lfgButton.classList.add('disabled')
      }
    })
    .catch(console.error)
}

function updateProfileGender() {
  const gender = document.getElementById("genderfixed").value
  console.log(gender);
  const formData = new FormData()
  formData.append("gender", gender)
  axios
    .post(`/update/gender/` || "http://localhost:3000/update/gender",formData)
    .then((res) => {
      document.getElementById("gender").innerText = res.data.user.gender
      const lfgButton = document.getElementById("lfg")
      if(res.data.user.activation.profileFinished){
        lfgButton.classList.remove('disabled')
      } else {
        lfgButton.classList.add('disabled')
      }
    })
    .catch(console.error)
}
