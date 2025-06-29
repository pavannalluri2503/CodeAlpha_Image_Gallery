const gallery = document.querySelector(".gallery");
const images = () => document.querySelectorAll(".gallery img");
const lightbox = document.querySelector(".lightbox");
const lightboxImg = document.querySelector(".lightbox-img");
const closeBtn = document.querySelector(".close");
const nextBtn = document.querySelector(".next");
const prevBtn = document.querySelector(".prev");
const filterButtons = document.querySelectorAll(".filters button");
const searchInput = document.getElementById("search");
const downloadLink = document.querySelector(".download");
const uploadInput = document.getElementById("upload");

let currentIndex = 0;
let autoPlayInterval;

function updateImageListeners() {
  images().forEach((img, index) => {
    img.addEventListener("click", () => openLightbox(index));
  });
}

function openLightbox(index) {
  lightbox.style.display = "flex";
  setLightboxImage(index);
  startAutoplay();
}

function setLightboxImage(index) {
  const imgElements = images();
  currentIndex = index;
  const src = imgElements[index].src;
  lightboxImg.src = src;
  downloadLink.href = src;
}

function closeLightbox() {
  lightbox.style.display = "none";
  lightboxImg.classList.remove("zoomed");
  stopAutoplay();
}

function showNextImage() {
  const imgList = images();
  currentIndex = (currentIndex + 1) % imgList.length;
  setLightboxImage(currentIndex);
}

function showPrevImage() {
  const imgList = images();
  currentIndex = (currentIndex - 1 + imgList.length) % imgList.length;
  setLightboxImage(currentIndex);
}

nextBtn.addEventListener("click", showNextImage);
prevBtn.addEventListener("click", showPrevImage);
closeBtn.addEventListener("click", closeLightbox);

lightboxImg.addEventListener("click", () => {
  lightboxImg.classList.toggle("zoomed");
});

filterButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    const filter = btn.getAttribute("data-filter");
    filterButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    images().forEach(img => {
      const category = img.getAttribute("data-category") || "uploaded";
      img.style.display = (filter === "all" || category === filter) ? "block" : "none";
    });
  });
});

searchInput.addEventListener("input", () => {
  const query = searchInput.value.toLowerCase();
  images().forEach(img => {
    const alt = img.alt.toLowerCase();
    img.style.display = alt.includes(query) ? "block" : "none";
  });
});

uploadInput.addEventListener("change", (e) => {
  const files = Array.from(e.target.files);
  files.forEach(file => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = document.createElement("img");
      img.src = e.target.result;
      img.alt = "Uploaded Image";
      img.setAttribute("data-category", "uploaded");
      gallery.appendChild(img);
      updateImageListeners();
    };
    reader.readAsDataURL(file);
  });
});

function startAutoplay() {
  stopAutoplay();
  autoPlayInterval = setInterval(showNextImage, 5);
}

function stopAutoplay() {
  if (autoPlayInterval) clearInterval(autoPlayInterval);
}

lightbox.addEventListener("mouseenter", stopAutoplay);
lightbox.addEventListener("mouseleave", startAutoplay);

updateImageListeners();
