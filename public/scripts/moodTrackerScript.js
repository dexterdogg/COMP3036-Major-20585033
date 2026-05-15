document.addEventListener('DOMContentLoaded', () => {
    const moodButtons = document.querySelectorAll('.moodButton');
    const noteInput = document.getElementById('moodNote');
    const saveButton = document.getElementById('moodSaveButton');
    const todayMood = document.getElementById('todaysMood');
    const saveMessage = document.getElementById('saveMessage');
    const selectedMoodInput = document.getElementById('selectedMood');

    let selectedMood = null;

    moodButtons.forEach(button => {
        button.addEventListener('click', () => {
            selectedMood = button.dataset.mood;

            moodButtons.forEach(btn => btn.classList.remove('selected'));

            button.classList.add('selected');

            selectedMoodInput.value = selectedMood;

            todayMood.innerHTML = `Selected mood: <strong>${selectedMood}</strong>`;

            saveMessage.classList.add('hidden');
        });
    });

    saveButton.addEventListener('click', (event) => {
        if (!selectedMood) {
            event.preventDefault();

            saveMessage.textContent = "Please select a mood.";
            saveMessage.classList.remove('hidden');
            return;
        }

        // Get the note entered by the user
        const note = noteInput.value;

        saveMessage.textContent = "Your mood has been saved!";
        saveMessage.classList.remove('hidden');
    });
});