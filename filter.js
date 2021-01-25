const getFilters = () => {
    setTimeout(function(){
        const filters = document.querySelectorAll('.productfilter')
        if (!filters.length) {
            getFilters()
        } else {
            initiateFilters(filters)
        }
    }, 10);
}
getFilters()

const generateDataStructure = (filterElements) => {
    const filters = []
    filterElements.forEach(filter => {
        let title = filter.children[0].textContent
        title = title.replaceAll(" --", "")
        title = title.replaceAll("-- ", "")
        const toAdd = {title: title, dataFilterId: filter.getAttribute('data-filter-id'), options: []}
        const children = Array.from(filter.children);
        children.shift()
        children.forEach(option => {
            toAdd.options.push({title: option.textContent, value: option.value})
        })
        filters.push(toAdd)
    })

    return filters
}

const showFilterElement = (filterName) => {
    document.querySelectorAll('.categoryDropdown').forEach((element) => {
        if (element.id !== filterName + 'Container') {
            element.style.height = 0
        }
    })

    const target = document.getElementById(filterName + 'Container')
    if (!target.style.height) {
        target.style.height = '0px'
    }
    const innerElement = target.querySelector('.animationWrapper')
    const childrenHeight = target.querySelector('.animationWrapper').scrollHeight
    target.style.height = target.style.height === '0px' ? childrenHeight + 'px' : 0

}

const applyFilter = (catId, id) => {
    const selects = document.querySelectorAll('select')
    let target
    selects.forEach(select => {
        if (select.getAttribute('data-filter-id') === catId) {
            target = select
        }
    })
    if (target.value === id) {
        target.value = ''
    } else {
        target.value = id
    }

    const filter_id = catId
    const chosen = id

    let selector = '.product'

    document.querySelectorAll('.productfilter').forEach(filter => {
        const filter_id = filter.getAttribute('data-filter-id') // 1669
        const chosen = filter.options[filter.selectedIndex].value; //15646 element

    	if(chosen > 0) {
    		selector += '[data-filter-'+filter_id+'-'+chosen+']';
    	}
    })

    document.querySelectorAll('.product').forEach(node => {
        node.classList.add('pf-hidden')
        node.style.display = 'none'
    })

    document.querySelectorAll(selector).forEach(node => {
        node.classList.remove('pf-hidden')
        node.style.display = 'block'
    })
}

const createPTag = (text) => {
    const element = document.createElement('p')
    element.textContent = text
    return element
}

const createDivTag = () => {
    const element = document.createElement('div')
    return element
}

const createTag = (filter) => {
    const element = createDivTag()
    element.id = filter.title + filter.value
    element.classList.add('tagWithCross')
    element.textContent = filter.title
    const cross = document.createElement('i')
    cross.classList.add('fas')
    cross.classList.add('fa-times')
    element.appendChild(cross)
    return element
}

const removeTag = (filter) => {
    document.getElementById(filter.title + filter.value).remove()
}

const initiateFilters = (filterElements) => {
    // Create filter categories
    const filters = generateDataStructure(filterElements)
    const target = document.querySelector('#newSearchFilters')
    const crossTagsContainer = document.createElement('div')
    crossTagsContainer.className = 'crossTagsContainer'
    target.appendChild(crossTagsContainer)
    const headerContainer = document.createElement('div')
    const animationContainer = document.createElement('div')
    animationContainer.classList.add('animationContainer')
    headerContainer.classList.add('titles', 'card')
    filters.forEach(filterCategory => {
        const headerElement = document.createElement('div')
        headerElement.textContent = filterCategory.title
        headerElement.addEventListener('click', () => {
            const children = Array.from(headerContainer.children);
            children.forEach(button => {
                button.style.backgroundColor = '#fff'
            })
            headerElement.style.backgroundColor = '#efefef'
            showFilterElement(filterCategory.title)
        })
        headerContainer.appendChild(headerElement)

        // Create filter containers
        const container = document.createElement('div')
        container.id = filterCategory.title + 'Container'
        container.classList.add('categoryDropdown')
        const animationWrapper = document.createElement('div')
        animationWrapper.classList.add('animationWrapper')
        // animationWrapper.classList.add('card')
        const useSizeHeadlines = filterCategory.title === 'Storlek' && !!(filterCategory.options.filter(item => (parseInt(item.title) && !item.title.includes('cm'))).length && filterCategory.options.filter(item => !parseInt(item.title)).length)
        if (useSizeHeadlines) {
            animationWrapper.appendChild(createPTag('Klädstorlekar'))
        }
        let hasSwitchedToShoeSizes = false
        filterCategory.options.forEach((filter) => {
            if (useSizeHeadlines && !hasSwitchedToShoeSizes && parseInt(filter.title) && !item.title.includes('cm')) {
                // Add skostorlekar
                animationWrapper.appendChild(createPTag('Skostorlekar'))
                hasSwitchedToShoeSizes = true
            }

            const item = document.createElement('div')
            const att = document.createAttribute('titleId')
            att.value = filter.title + filter.value
            item.setAttributeNode(att)
            item.textContent = filter.title
            item.addEventListener('click', () => {
                const handleClick = () => {
                    const wasSelected = item.className === 'selected'
                    const nodes = animationWrapper.querySelectorAll('.selected').forEach(element => {
                        document.getElementById(element.getAttribute('titleId')).remove()
                        element.classList.remove('selected')
                    })
                    if (!wasSelected) {
                        item.classList.add('selected')
                        const mainContainer = document.getElementById('newSearchFilters')
                        const newTag = createTag(filter)
                        newTag.addEventListener('click', () => {
                            handleClick()
                        })
                        crossTagsContainer.appendChild(newTag)
                    }
                    applyFilter(filterCategory.dataFilterId ,filter.value)
                }
                handleClick()

            })
            animationWrapper.appendChild(item)
        })
        container.appendChild(animationWrapper)
        animationContainer.appendChild(container)
    })
    target.appendChild(headerContainer)
    target.appendChild(animationContainer)
}
