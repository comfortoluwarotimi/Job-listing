// Global Selectors
const output = document.getElementById('allSections');
const filterBar = document.getElementById('filterBar');
const clear = document.getElementById('clear');

// Global Variables
let filtersAdded = {};
let filterContent = '';

// Uses data.json to implement dynamicly html code.
async function fetchData() {
    return fetch('data.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            return response.json();
        });
};

fetchData()
    .then(data => {

        // Create a DocumentFragment to hold the new HTML elements for more optimisation
        const fragment = document.createDocumentFragment();

        data.map((e) => {

            let {
                company,
                contract,
                featured,
                id,
                languages,
                level,
                location,
                logo,
                recent,
                position,
                postedAt,
                role,
                tools
            } = e;

            let language = languages.map(i => `<span class="lang filter">${i}</span>`).join('');
            let tool = tools.map(i => `<span class="tool filter">${i}</span>`).join('');

            // Create a new section element and set its innerHTML to the generated HTML string
            const section = document.createElement('section');
            section.className = 'section';
            section.id = id;
            section.innerHTML = `
                <img class="logo" src="${logo}" alt="logo">
                <div class="flex-row-column">
                    <div class="line-one">
                        <span class="company">${company}</span>
                        ${recent ? '<span class="new">NEW!</span>' : ''}
                        ${featured ? '<span class="featured">FEATURED</span>' : ''}
                    </div>
                    <h1 class="position">${position}</h1>
                    <div class="line-two">
                        <span class="posted-at">${postedAt}</span>
                        <span class="contract">${contract}</span>
                        <span class="location">${location}</span>
                    </div>
                </div>
                <div class="border"></div>
                <div class="box">
                  <span class="role filter">${role}</span>
                  <span class="level filter">${level}</span>
                  ${language}
                  ${tool}
                </div>
              `;

            // Append the new section element to the fragment
            fragment.append(section);
        });
        // Append the fragment, which contains all the new section elements, to the output element
        output.append(fragment);

        // Interactions with filter tablets and filter bar in which filter tablets appear when clicked. 
        const filterTablets = document.querySelectorAll('.filter');
        const allSections = document.querySelectorAll('.section');

        // functions
        function showFilterBar() {
            filterBar.style.display = 'flex';
            clear.style.display = 'flex';
        }

        function hideFilterBar() {
            filterBar.style.display = 'none';
            clear.style.display = 'none';
        }

        function allSectionsAppear() {
            allSections.forEach(e => e.style.display = 'flex');
        };

        // A clicked filter button triggers filter bar in which appears filter button content with a remove icon
        filterTablets.forEach((e) => {
            e.addEventListener('click', (i) => {
                showFilterBar()
                filterContent = i.target.textContent;
                if (!filtersAdded[filterContent]) {
                    filtersAdded[filterContent] = true;
                    addFilterTablet(filterContent);
                    filterSections();
                }
            });
        });

        // Creates filter in filter bar
        function addFilterTablet(filterContent) {
            const filterTablet = document.createElement('span');
            filterTablet.setAttribute('class', 'filter-button');
            filterTablet.innerHTML = `${filterContent}<img class="remove-icon" src="images/icon-remove.svg" alt="remove icon">`;
            filterBar.insertAdjacentElement('beforeend', filterTablet);
            const removeButton = filterTablet.querySelector('.remove-icon');
            removeFilterTablet(removeButton);
        }



        // Filters all sections whether thay include filter. 
        function filterSections() {
            const filterContents = Object.keys(filtersAdded);
            allSections.forEach((section) => {
                const sectionContent = section.textContent;
                const shouldShowSection = filterContents.every((filterContent) => sectionContent.includes(filterContent));
                section.style.display = shouldShowSection ? 'flex' : 'none';
            });
        }

        // Removes filter buttons. If no filter button remained, clears all.
        function removeFilterTablet(removeButton) {
            removeButton.addEventListener('click', e => {
                const filterTablet = e.target.parentNode;
                const removedfilterContent = filterTablet.textContent.trim().replace('×', '');
                delete filtersAdded[removedfilterContent];
                filterTablet.remove();
                filterBar.textContent.trim() === 'Clear' ? clearAllFilters() : null;
                filterSections();
            });
        };


        // 'clearAllFilters' function clears all elements within the 'filterBar'.
        function clearAllFilters() {
            const elementsToClear = document.querySelectorAll('#filterBar > :not(#clear)');
            elementsToClear.forEach((element) => element.remove());
            filtersAdded = {};
            hideFilterBar()
            allSectionsAppear();
        };

        // Clear button activates clearAllFilters function which clears all elements within the filterBar.
        clear.addEventListener('click', e => {
            e.preventDefault();
            clearAllFilters();
        });
    })
    .catch(error => {
        console.error(error);
    });
