<template>
  <v-container fluid>
    <v-layout justify-center wrap class="my-4" align-center>
      <section>
        <h1>Frequently Asked Questions</h1>
        <div>
          <h3>What is this project all about?</h3>
          <p>
            This application collects speech read by contributors to publish a
            free licensed speech corpus of Malayalam language for various
            research purposes. We have published the curated corpus
            <a href="https://blog.smc.org.in/malayalam-speech-corpus/">here</a>
          </p>
          <h3>How can I contribute to this project?</h3>
          <p>
            You can contribute by recording your voice and reviewing voices
            recorded by others. (<a href="../usage">ഉപയോഗക്രമം മലയാളത്തിൽ</a>)
          </p>
          <h4>Record</h4>
          <p>
            This web application presents you sentences that you can read aloud
            and record. It would be ideal to record it in a silent environment.
            After every record, before moving on to the next sentence you can
            listen to what you just recorded and verify it for clarity. In case
            you are not satisfied, delete it and rerecord.
          </p>
          <h4>Review</h4>
          <p>
            Inorder to ensure quality of recordings, review option is provided.
            In the review mode you will be presented with a recording and the
            corresponding sentence. If the voice recording is a good match with
            the setence, give an upvote else a downvote. The reviewer will not
            be given the details of the voice owner.
          </p>
          <h3>What license will the data collected be published?</h3>
          <p>
            The corpus will be published under
            <a href="https://creativecommons.org/licenses/by-sa/3.0/">
              CC-BY-SA license.
            </a>
          </p>
          <h3>Why do you need me to login to contribute?</h3>
          <p>
            Since the data will be published in CC-BY-SA license, we require
            your name to properly attribute your contributions to you. Your
            email address will not be published.
          </p>
          <h3>If I do not want attribution, can I contribute anonymously?</h3>
          <p>
            Still you need to login to track unique identity. This is important
            to avoid you recording the same sentence multiple times, to present
            you with others voice for review and not your own etc. Also this
            prevents unintentional spamming. You can always opt out from
            providing your name, age or gender information.
          </p>
          <h3>Isn't Mozilla Common Voice also doing something similar?</h3>
          <p>
            Yes. But there are few reasons for why we decided to go with a
            separate effort:
          </p>
          <ol>
            <li>
              We wanted to properly credit contributors, and release the data in
              CC-BY-SA license. Mozilla Common Voice, since it releases the
              dataset under CC0 license doesn't satisfy this requirement.
            </li>
            <li>
              Mozilla Common Voice requires the source data also to be in CC0
              license. It is extremely difficult to find Malayalam content in
              CC0 license that aren't very old (and thus almost irrelevant to
              the current usage styles and patterns of the language), while it
              is relatively easier to find CC-BY-SA content.
            </li>
          </ol>
          <h3>Can I contribute sentences to the text corpus?</h3>
          <p>
            Definitely. However, do note that you can not add text that is not
            released under CC-BY-SA license. For example, this means you can not
            just copy text from a book or website that is not released under
            CC-BY-SA license. Also, please note that by providing your own text
            content, you agree to release it under CC-BY-SA license. Inorder to
            contribute sentences visit the project
            <a href="https://gitlab.com/smc/msc">
              repository.
            </a>
          </p>
        </div>
      </section>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  name: "Faq"
};
</script>
