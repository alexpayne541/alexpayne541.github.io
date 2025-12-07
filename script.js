// Data arrays
let progressUpdates = [];
let budgetItems = [];
let wishList = [];

// Default hero image source
const DEFAULT_HERO_SRC = "images/hero.avif";

document.addEventListener("DOMContentLoaded", function () {
    setupTabs();
    setupHeroControls();
    setupBuildStoryControls();
    setupProgressForm();
    setupBudgetForm();
    setupWishListForm();

    // Sample data so the page is not empty
    addSampleData();
    renderProgressUpdates();
    renderBudgetTable();
    renderBudgetTotals();
    renderWishListTable();
    renderGallery();
});

// ---------------- TABS ----------------

function setupTabs() {
    const tabButtons = document.querySelectorAll("#tabs .tab");
    const tabContents = document.querySelectorAll(".tab-content");

    tabButtons.forEach(function (button) {
        button.addEventListener("click", function () {
            const targetId = button.getAttribute("data-tab");

            // Update active button
            tabButtons.forEach(function (btn) {
                btn.classList.remove("active");
            });
            button.classList.add("active");

            // Show the matching section, hide the others
            tabContents.forEach(function (section) {
                if (section.id === targetId) {
                    section.classList.add("active");
                } else {
                    section.classList.remove("active");
                }
            });
        });
    });
}

// ---------------- HERO IMAGE CONTROLS ----------------

function setupHeroControls() {
    const heroImg = document.getElementById("hero-image");
    const heroInput = document.getElementById("hero-image-input");
    const updateBtn = document.getElementById("hero-update-btn");
    const resetBtn = document.getElementById("hero-reset-btn");
    const removeBtn = document.getElementById("hero-remove-btn");

    // Set hero image from URL
    updateBtn.addEventListener("click", function () {
        const url = heroInput.value.trim();

        if (url === "") {
            alert("Please paste an image URL first.");
            return;
        }

        heroImg.src = url;
        heroImg.style.display = "block";
    });

    // Reset to default hero image
    resetBtn.addEventListener("click", function () {
        heroImg.src = DEFAULT_HERO_SRC;
        heroImg.style.display = "block";
        heroInput.value = "";
    });

    // Remove hero image
    removeBtn.addEventListener("click", function () {
        heroImg.src = "";
        heroImg.style.display = "none";
    });
}

// ---------------- BUILD STORY CONTROLS ----------------

function setupBuildStoryControls() {
    const storyParagraph = document.getElementById("build-story-text");
    const storyInput = document.getElementById("build-story-input");
    const updateBtn = document.getElementById("build-story-update-btn");

    // Start with the current story text in the textarea
    storyInput.value = storyParagraph.textContent.trim();

    updateBtn.addEventListener("click", function () {
        const newText = storyInput.value.trim();

        if (newText === "") {
            alert("Please enter some text for the build story.");
            return;
        }

        storyParagraph.textContent = newText;
    });
}

// ---------------- PROGRESS FORM + RENDER ----------------

function setupProgressForm() {
    const addButton = document.getElementById("add-progress-btn");

    addButton.addEventListener("click", function () {
        const dateInput = document.getElementById("progress-date");
        const titleInput = document.getElementById("progress-title");
        const descInput = document.getElementById("progress-description");
        const imageInput = document.getElementById("progress-image");

        const date = dateInput.value;
        const title = titleInput.value.trim();
        const description = descInput.value.trim();
        const imageUrl = imageInput.value.trim();

        if (title === "" || description === "") {
            alert("Please enter a title and description for the update.");
            return;
        }

        const update = {
            date: date,
            title: title,
            description: description,
            imageUrl: imageUrl
        };

        progressUpdates.push(update);

        // Clear form
        dateInput.value = "";
        titleInput.value = "";
        descInput.value = "";
        imageInput.value = "";

        renderProgressUpdates();
        renderGallery();
    });
}

function renderProgressUpdates() {
    const list = document.getElementById("progress-list");
    list.innerHTML = "";

    if (progressUpdates.length === 0) {
        list.innerHTML = "<p>No progress updates yet.</p>";
        return;
    }

    // Show newest first
    const reversed = [...progressUpdates].reverse();

    reversed.forEach(function (update) {
        const card = document.createElement("div");
        card.className = "progress-card";

        if (update.imageUrl) {
            const img = document.createElement("img");
            img.src = update.imageUrl;
            img.alt = update.title;
            card.appendChild(img);
        }

        const info = document.createElement("div");
        info.className = "progress-info";

        const titleEl = document.createElement("h4");
        titleEl.textContent = update.title;

        const meta = document.createElement("div");
        meta.className = "progress-meta";
        meta.textContent = update.date ? "Date: " + update.date : "Date: not set";

        const desc = document.createElement("p");
        desc.textContent = update.description;

        info.appendChild(titleEl);
        info.appendChild(meta);
        info.appendChild(desc);

        card.appendChild(info);

        list.appendChild(card);
    });
}

// ---------------- BUDGET FORM + RENDER ----------------

function setupBudgetForm() {
    const addButton = document.getElementById("add-budget-btn");

    addButton.addEventListener("click", function () {
        const categorySelect = document.getElementById("budget-category");
        const itemInput = document.getElementById("budget-item");
        const costInput = document.getElementById("budget-cost");

        const category = categorySelect.value;
        const itemName = itemInput.value.trim();
        const cost = parseFloat(costInput.value);

        if (itemName === "" || isNaN(cost)) {
            alert("Please enter an item name and a valid cost.");
            return;
        }

        const budgetItem = {
            category: category,
            item: itemName,
            cost: cost
        };

        budgetItems.push(budgetItem);

        itemInput.value = "";
        costInput.value = "";

        renderBudgetTable();
        renderBudgetTotals();
    });
}

function renderBudgetTable() {
    const tableBody = document.querySelector("#budget-table tbody");
    tableBody.innerHTML = "";

    if (budgetItems.length === 0) {
        const row = document.createElement("tr");
        const cell = document.createElement("td");
        cell.colSpan = 3;
        cell.textContent = "No budget items yet.";
        row.appendChild(cell);
        tableBody.appendChild(row);
        return;
    }

    budgetItems.forEach(function (item) {
        const row = document.createElement("tr");

        const catTd = document.createElement("td");
        catTd.textContent = item.category;

        const itemTd = document.createElement("td");
        itemTd.textContent = item.item;

        const costTd = document.createElement("td");
        costTd.textContent = "$" + item.cost.toFixed(2);

        row.appendChild(catTd);
        row.appendChild(itemTd);
        row.appendChild(costTd);

        tableBody.appendChild(row);
    });
}

function renderBudgetTotals() {
    const totalsDiv = document.getElementById("budget-totals");
    totalsDiv.innerHTML = "";

    if (budgetItems.length === 0) {
        totalsDiv.textContent = "Total spent so far: $0.00";
        return;
    }

    let totalsByCategory = {};
    let overallTotal = 0;

    budgetItems.forEach(function (item) {
        if (!totalsByCategory[item.category]) {
            totalsByCategory[item.category] = 0;
        }
        totalsByCategory[item.category] += item.cost;
        overallTotal += item.cost;
    });

    for (let category in totalsByCategory) {
        const p = document.createElement("p");
        p.textContent = category + ": $" + totalsByCategory[category].toFixed(2);
        totalsDiv.appendChild(p);
    }

    const overallP = document.createElement("p");
    overallP.style.marginTop = "6px";
    overallP.style.fontWeight = "bold";
    overallP.textContent = "Overall total: $" + overallTotal.toFixed(2);
    totalsDiv.appendChild(overallP);
}

// ---------------- WISH LIST FORM + RENDER ----------------

function setupWishListForm() {
    const addButton = document.getElementById("add-wishlist-btn");

    addButton.addEventListener("click", function () {
        const categorySelect = document.getElementById("wishlist-category");
        const itemInput = document.getElementById("wishlist-item");
        const costInput = document.getElementById("wishlist-cost");

        const category = categorySelect.value;
        const itemName = itemInput.value.trim();
        const estimatedCost = parseFloat(costInput.value);

        if (itemName === "" || isNaN(estimatedCost)) {
            alert("Please enter an item name and a valid estimated cost.");
            return;
        }

        const wishItem = {
            category: category,
            item: itemName,
            estimatedCost: estimatedCost
        };

        wishList.push(wishItem);

        itemInput.value = "";
        costInput.value = "";

        renderWishListTable();
    });
}

function renderWishListTable() {
    const tableBody = document.querySelector("#wishlist-table tbody");
    tableBody.innerHTML = "";

    if (wishList.length === 0) {
        const row = document.createElement("tr");
        const cell = document.createElement("td");
        cell.colSpan = 3;
        cell.textContent = "No wish list items yet.";
        row.appendChild(cell);
        tableBody.appendChild(row);
        return;
    }

    wishList.forEach(function (item) {
        const row = document.createElement("tr");

        const catTd = document.createElement("td");
        catTd.textContent = item.category;

        const itemTd = document.createElement("td");
        itemTd.textContent = item.item;

        const costTd = document.createElement("td");
        costTd.textContent = "$" + item.estimatedCost.toFixed(2);

        row.appendChild(catTd);
        row.appendChild(itemTd);
        row.appendChild(costTd);

        tableBody.appendChild(row);
    });
}

// ---------------- GALLERY RENDER ----------------

function renderGallery() {
    const galleryDiv = document.getElementById("gallery-grid");
    galleryDiv.innerHTML = "";

    // Collect all images from progress updates that have imageUrl
    const images = progressUpdates
        .filter(function (update) {
            return update.imageUrl && update.imageUrl.trim() !== "";
        })
        .map(function (update) {
            return update.imageUrl;
        });

    if (images.length === 0) {
        galleryDiv.innerHTML = "<p>No photos yet. Add some images in the Progress tab.</p>";
        return;
    }

    images.forEach(function (url) {
        const img = document.createElement("img");
        img.src = url;
        img.alt = "Build photo";
        galleryDiv.appendChild(img);
    });
}

// ---------------- SAMPLE DATA ----------------

function addSampleData() {
    // ----- PROGRESS ENTRIES -----

    // Entry 1
    progressUpdates.push({
        date: "2024-06-26",
        title: "Project Officially Begins",
        description: "Today the journey to my dream car began with the purchase of this 1978 Camaro shell. She was obviously not in the best shape considering that she was fully stripped down to an empty shell. However, the biggest thing that mattered to me was that she wasn't rusted out. In fact, the more I looked, the more I realized how killer the shape of this shell truly was. So, I didn't even argue with the seller and paid him the 250 bucks he was asking. We loaded it up onto my brother's flatbed with a tractor and made the journey home, both of us wearing big grins discussing what this car could become.",
        imageUrl: "images/Day1.jpg"
    });

    // Entry 2
    progressUpdates.push({
        date: "2025-06-15", // Father's Day 2025
        title: "First Trip to a Car Show",
        description: "Well, after months of hard work, endless long nights, a lot of sweat, grit, and money later, I finally got to debut her as a running, driving car at the Father's Day Shakedown Car Show at the Waypoint Church in Springfield. She was still very much a diamond in the rough, needed a ton of body work, and the seats were still terrible, but she drove under her own power. Considering she had to be loaded on a trailer with a tractor just 6 months prior, I'd call that a win. Next year she will be back, looking even better!",
        imageUrl: "images/Fathersday.jpg"
    });

    // Entry 3
    progressUpdates.push({
        date: "2025-11-24",
        title: "How She Currently Sits",
        description: "At this point, most of the important metal work has been completed. I changed the tail panel and quarter panel ends and modified the entire backend from the 1978 style to the 1971 rear end that I vastly prefer. Sure, it will infuriate purists, especially once they learn that I cut up a perfectly solid, rust-free car—let alone a true Z28—to do so. But they can cry; it's my car, and I'm thrilled with how it looks. I consider it a fast improvement.",
        imageUrl: "images/Current.jpg"
    });

    // ----- BUDGET STARTER ITEMS -----

    budgetItems.push({
        category: "Motor",
        item: "Bought Shell",
        cost: 250
    });

    budgetItems.push({
        category: "Transmission",
        item: "Muncie 4-speed Transmission",
        cost: 1200
    });

    budgetItems.push({
        category: "Body Work",
        item: "Fenders (Pair)",
        cost: 400
    });
}
wishList.push({
    category: "Transmission",
    item: "TKO 5-Speed Conversion",
    estimatedCost: 4600
});

wishList.push({
    category: "Body Work",
    item: "L88 Hood",
    estimatedCost: 1200
});

wishList.push({
    category: "Paint",
    item: "Seductive Red Paint (per gallon)",
    estimatedCost: 900
});
