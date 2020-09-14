function selectNo(id) {
  const currentCard = document.getElementById(`card-${id}`)
  currentCard.classList.add("animate__fadeOutLeft")
  currentCard.classList.add("animate__animated")
  const nextUserToShow = currentCard.parentElement.nextElementSibling
  if (nextUserToShow) {
    showNextUser(nextUserToShow)
  }
  afterAnimationRemoveElement(currentCard)
}

function selectYes(id) {
  const currentCard = document.getElementById(`card-${id}`)
  currentCard.classList.add("animate__fadeOutRight")
  currentCard.classList.add("animate__animated")
  const nextUserToShow = currentCard.parentElement.nextElementSibling
  if (nextUserToShow) {
    showNextUser(nextUserToShow)
  }
  afterAnimationRemoveElement(currentCard)

  axios
    .post(`/likeUser/${id}/` || `http://localhost:3000/update/${field}`)
    .then((res) => {
      console.log(res.data.petition)
      if (res.data.petition === "MATCH") {
        const createdButtonElement = document.createElement("button")
        createdButtonElement.type = "button"
        createdButtonElement.classList.add("btn")
        createdButtonElement.classList.add("btn-dark")
        createdButtonElement.classList.add("btn-sm")
        createdButtonElement.classList.add("mb-2")
        createdButtonElement.classList.add("text-truncate")
        createdButtonElement.id = `button-${res.data.likedUser._id}`
        createdButtonElement.innerText = `@${res.data.likedUser.username}`
        const userMatches = document.getElementById("user-matches")
        userMatches.append(createdButtonElement)
        createMatchedUserModal(res.data.likedUser)
      }
    })
}

function showNextUser(element) {
  element.classList.add("showing")
  element.classList.add("animate__fadeIn")
  element.classList.add("animate__animated")
}

function afterAnimationRemoveElement(element) {
  element.addEventListener("animationend", () => {
    element.parentElement.remove()
  })
}

function createMatchedUserModal(user) {
  const parentElement = document.getElementById(`user-matches`)
  const buttonElement = document.getElementById(`button-${user._id}`)
  buttonElement.style.maxWidth = "150px"
  buttonElement.setAttribute("data-toggle", "modal")
  buttonElement.setAttribute("data-target", `#matchedUserModal-${user._id}`)
  const modalElement = document.createElement("div")
  modalElement.innerHTML = `
    <div class="modal fade" id="matchedUserModal-${user._id}" tabindex="-1"
                    aria-labelledby="matchedUserModal-${
                      user._id
                    }" aria-hidden="true">
                    <div class="modal-dialog modal-dialog-centered">
                        <div class="modal-content user-card">
                            <div class="modal-header border-0">
                                <h5 class="modal-title" id="matchedUserModal-${
                                  user._id
                                }">
                                    @${user.username}</h5>
                                <img src="${
                                  user.avatar
                                } alt="user avatar" width=50 class="rounded-circle">
                            </div>
                            <div class="modal-body inner-card-description border border-dark m-2 rounded">
                                <div class="row ">
                                    <h6 class="w-100">Game Tags</h6>
                                    ${createGameTagsElements(user.gameTags)}
                                </div>
                                <div class="row border-top boder-white pt-2 ">
                                    <h6 class="w-100">Description</h6>
                                    <p class="px-2">@${user.description}</p>
                                </div>
                                <div class="row border-top boder-white pt-2 ">
                                    <h6 class="w-100">Plays</h6>
                                    ${createGamePlaysElements(user.games)}
                                </div>
                            </div>
                            <div class="modal-footer border-0">
                                <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                            </div>
                        </div>
                    </div>
                </div>
    `
  const test = document.getElementById(`matchedUserModal-${user._id}`)
  parentElement.append(modalElement)
}

function createGameTagsElements(gameTagArray) {
  let finalString = ""
  Object.keys(gameTagArray).forEach((k) => {
    
    finalString = finalString.concat(`
            <div class="col-md-auto w-50">
                  <p class="font-weight-bold mt-1 mb-0 ">${k}</p>
                  <p class="font-weight-normal border-bottom border-dark">${gameTagArray[k]}</p>                                                
            </div>
  `)
  console.log(finalString)
  })
 
  return finalString
}

function createGamePlaysElements(gamesArray) {
  let finalString = ""
  gamesArray.forEach((game) =>{
    finalString = finalString.concat(`
    <p class="px-2">${game.name}</p>
  `)
  })
    
  return finalString
}
