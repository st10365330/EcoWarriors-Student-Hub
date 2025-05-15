$(document).ready(function() {
    // Define an array of inspirational quotes
    var quotes = [
        "The best way to predict the future is to create it. - Peter Drucker",
        "The only way to do great work is to love what you do. - Steve Jobs",
        "Believe you can and you're halfway there. - Theodore Roosevelt",
        "The future belongs to those who believe in the beauty of their dreams. - Eleanor Roosevelt",
        "Your time is limited, don't waste it living someone else's life. - Steve Jobs"
    
    ];

    // Function to update the quote of the day
    function updateQuote() {
        var randomIndex = Math.floor(Math.random() * quotes.length);
        var quote = quotes[randomIndex];

        // Wrap the quote in <strong> (bold) and <em> (italic) tags
        var formattedQuote = '<strong><em>' + quote + '</em></strong>';

        // Update the content of the quote element
        $("#quoteOfTheDay").html(formattedQuote);
    }

    // Initial update
    updateQuote();

    // Set interval to update the quote periodically (e.g., daily)
    setInterval(updateQuote, 24 * 60 * 60 * 1000); // 24 hours in milliseconds
});
