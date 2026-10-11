document.addEventListener('DOMContentLoaded', () => {
  const pages = Array.from(document.querySelectorAll('.page'));
  const navButtons = Array.from(document.querySelectorAll('.bottom-nav button'));

  const openPage = (pageId) => {
    pages.forEach((page) => {
      const isActive = page.id === pageId;
      page.classList.toggle('active', isActive);
      page.style.display = isActive ? '' : 'none';
    });

    navButtons.forEach((button) => {
      const buttonPage = button.getAttribute('onclick');
      const isActive = buttonPage && buttonPage.includes(`'${pageId}'`);
      button.classList.toggle('active', !!isActive);
    });
  };

  window.openPage = openPage;

  const activePage = document.querySelector('.page.active') || pages[0];
  if (activePage) {
    openPage(activePage.id);
  }
});
