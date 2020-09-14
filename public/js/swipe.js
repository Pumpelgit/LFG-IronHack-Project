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
    const button = getElementById(`button-${user.id}`)
    const modalElement = createElement("div")
    modalElement.innerText = `
    <div class="modal fade" id="matchedUserModal-${user.id}" tabindex="-1" aria-labelledby="matchedUserModal-${user.id}" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="matchedUserModal-${user.id}">@${user.username}</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="row">              
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                </div>
            </div>
        </div>
    </div>
    `
    button.append(modalElement)
    
}
