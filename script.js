const btn = document.querySelector('.btn-open');
const original_btn_text = btn.textContent;
const form = document.querySelector('.fact-form')

btn.addEventListener('click', function() {
    if (form.classList.contains('hidden')) {
        form.classList.remove('hidden');
        btn.textContent = "Closed";
    } else {
        form.classList.add('hidden');
        btn.textContent = original_btn_text;
    }
})