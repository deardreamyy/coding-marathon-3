Example 1: Improving error messages.
We were a bit lazy on providing contextual error messages so some of our error messages could be better, like for example:
```
{
    {
    if (updatedJob) {
      res.status(200).json(updatedJob);
    } else {
      res.status(404).json({ message: "Job not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Failed to update job" });
  }
};
```
The error messages here could have been improved by adding additional info like this by adding the message:
```
res.status(500).json({ message: "Failed to update job", error: error.message });
```

Example 2: Validation improvements.

In the jobModel we could use additional validation for our salary and applicationDeadline.Right now we only limit salary to numbers and applicationDeadline to a date, but we could limit salary to positive numbers and applicationDeadline to future dates like so:
```
 salary: {
    type: Number,
    required: true,
    min: [0, 'Salary cannot be negative'],
},
applicationDeadline: {
    type: Date,
    validate: {
        validator: (value) => value > new Date(),
        message: 'Application deadline must be in the future',
    },
},
```
Example 3: Better token handling in tests.

According to a LLM, hardcoding token headers in tests is questionable and instead of using bearer ${token}, we should use a helper function to dynamically attach the token for reusability, like so:
```
const authHeader = () => `bearer ${token}`;
api.post("/api/jobs").set("Authorization", authHeader()).send(newJob);
```

Example 4: Logging for debugging.

We're not really using any debug logs so we could use something like Winston, Pino or Morgan for this.


