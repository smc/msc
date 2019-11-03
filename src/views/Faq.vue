<template>
  <v-container fluid>
    <v-layout justify-center wrap class="my-4" align-center>
      <section>
        <h1>Frequently Asked Questions</h1>
        <div>
          <h3>What is this project all about?</h3>
          <p>
            This project attempts to create a free licensed speech corpus of
            Malayalam language for various research purposes.
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
            your name and email address to properly attribute your contributions
            to you.
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
            content, you agree to release it under CC-BY-SA license.
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
