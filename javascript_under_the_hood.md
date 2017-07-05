# Javascript: under the hood

---
Todo:
// 写出为什么要写这篇文章的原因。
// 文章的重点在于解释出Javascript背后的很多原理，特色是解释清楚每个概念的含义，包括对一些详细概念的深度探索。
// 先纪录下重点概念


Syntax Parser: A program that reads your code and determines what it does and if its grammar is valid.

compiler or interpretor:

Lexical Environment: where something sits physically in the code you write.
'Lexical' means 'of or relating to words or the vocabulary of a language as distinguished from its grammar and construction', 这段解释是来自Webster词典的。首先要理解什么是lexical, 在很多词典中的解释中，你很难理解lexical到底具体是什么意思, Webster词典中的解释的后半段提醒了我，它指的是“语言中单词和词汇相关的”, 区别于语言的语法和构造等其他方面。而词汇有什么特点呢, 词典中通常是写一个单词加一个冒号后面在跟它的释义，这个可以和函数定义联系起来，将函数名称看作单词本身，函数的定义看作单词的释义。


Execution Context: A wrapper to help manage the code that is running.

There are a lots of lexical environments. Which one is currently running is managed via execution context. It can contain things beyond what you've written in your code.



