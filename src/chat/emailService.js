export const sendEmailNotification = async ({
    recipientEmail,
    recipientName,
    senderName,
    messageContent,
    bookName,
}) => {
    const res = await fetch("https://mailer-kkjf.onrender.com/send-email", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            recipientEmail,
            recipientName,
            senderName,
            messageContent,
            bookName,
        }),
    });

    if (!res.ok) {
        const error = await res.text();
        throw new Error(error);
    }

    return res.json();
};