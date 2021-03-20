module.exports = {

    // Keeps the decimals of a number only if there is any
    formatDouble: (number) => {
        let formattedNumber = number
        if (Math.round(number) !== number) {
            formattedNumber = number.toFixed(2);
        }
        return formattedNumber
    }
}