class URLParser {
    static async redirectURL(url, destinationPage) {
        // ex. url = "http://www.google.com/login.html"
        // ex. destinationPage = "index.html"
        try {
            const urlParts = url.split('/');
            urlParts[urlParts.length - 1] = destinationPage;
            url = urlParts.join('/');
            return url;
        }
        catch (error) {
            throw new Error(error.message);
        }
    }
}

export { URLParser };

//(async()  => {
//    const url = "http://www.google.com/index.html"
//    const destinationPage = "james.html"
//    const res1 = await URLParser.redirectURL(url,destinationPage)
//    console.log(res1)
//})();