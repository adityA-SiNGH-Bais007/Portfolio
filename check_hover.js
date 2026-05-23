import { chromium } from 'playwright';

(async () => {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto('http://localhost:3000');
    
    // Wait for the projects section to be visible
    await page.waitForSelector('#projects');
    
    // Scroll to projects section to trigger IntersectionObserver
    await page.evaluate(() => {
        document.getElementById('projects').scrollIntoView();
    });
    
    // Wait a bit for animations
    await page.waitForTimeout(1000);
    
    // Check classes of project card
    const cardInfo = await page.evaluate(() => {
        const card = document.querySelector('.project-card');
        const inner = card.querySelector('.project-inner');
        return {
            cardClasses: card.className,
            cardOverflow: getComputedStyle(card).overflow,
            innerTransform: getComputedStyle(inner).transform,
            innerTransition: getComputedStyle(inner).transition
        };
    });
    console.log("Before Hover:");
    console.log(cardInfo);
    
    // Hover the project card
    await page.hover('.project-card');
    
    // Wait for transition
    await page.waitForTimeout(1000);
    
    const cardInfoAfter = await page.evaluate(() => {
        const card = document.querySelector('.project-card');
        const inner = card.querySelector('.project-inner');
        return {
            cardClasses: card.className,
            cardOverflow: getComputedStyle(card).overflow,
            innerTransform: getComputedStyle(inner).transform
        };
    });
    console.log("After Hover:");
    console.log(cardInfoAfter);
    
    await browser.close();
})();
