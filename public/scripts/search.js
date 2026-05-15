
const popupCard = document.getElementById("popupCard");
//GET
const popupTitle = document.getElementById("card_title");
const popupID = document.getElementById("card_ID")
const popupDate = document.getElementById("card_date");
const popupSchedDate = document.getElementById("card_schedule");
const popupLocation = document.getElementById("card_location");
const popupDescription = document.getElementById("card_description");
const registerForm = document.getElementById("registerForm");


//Function to get JSON event
async function fetchEventById(id) {

  const event = await fetch(`/search/${id}`);
  if (!event.ok) {
    throw new Error("Failed to fetch event");
  }
  return await event.json();
}

//Function to display event details in popup
document.addEventListener("DOMContentLoaded", async () => {
  const btnClose = document.getElementById("btn_close");
  const btnConfirm = document.getElementById("btn_confirm")
  const registerButtons = document.querySelectorAll(".btn_register");
  const eventCards = document.querySelectorAll(".box_information");

  for (const [index, button] of registerButtons.entries()) {
    button.addEventListener("click", async () => {
      popupCard.classList.remove("hidden");
      const id = eventCards[index].querySelector(".info_eventId").textContent;
      const event = await fetchEventById(id);

      //SET
      popupTitle.textContent = event.name;
      popupDate.textContent = event.date;
      popupSchedDate.textContent = event.schedule;
      popupLocation.textContent = event.location;
      popupDescription.textContent = event.description;
      popupID.textContent = event.id;

      registerForm.action = `/search/register/${event.id}`;

      console.log("Selected Event ID:", id);
    });
  }

  btnClose.addEventListener("click", () => {
    popupCard.classList.add("hidden");
    console.log("Popup closed");
  });

  btnConfirm.addEventListener("click", async (e) => {
    e.preventDefault(); // Stop the form from navigating away

    const eventID = popupID.textContent;
    const response = await fetch(`/search/register/${eventID}`, { method: "POST" });

    if (response.redirected) {
      window.location.href = response.url;
      return;
    }

    const data = await response.json();
    popupCard.classList.add("hidden");

    if (data.status === "exists") {
      alert(data.message);
    } else if (data.status === "success") {
      alert(data.message);
    } else {
      alert("Error: " + data.message);
    }
    console.log("Server responded:", data);
  });
});

// References
// javascript iterables = https://www.w3schools.com/js/js_iterables.asp
//