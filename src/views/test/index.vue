<script setup lang="ts"></script>

<template>
  <div class="mdmdt">
    <div style="display: flex; flex-direction: column; padding: 20px; background: linear-gradient(to bottom right, #fff9f6, 60%, #ebded3)">
      <h1>关于Mdmdt主题</h1>
      <p>
        <strong
          >Mdmdt
          <strong
            >是 markdown minimalism document theme 的缩写，意为: <strong>Markdown极简文档主题</strong>。
            <strong>Mdmdt</strong>[^1]是深度定制的个性化Typora主题，其目的是打造一个</strong
          >清爽极简</strong
        >的文档样式。
      </p>
      <blockquote>
        <p>[!NOte]</p>
        <p>
          **注意：**mdmdt.css 文件中包含了亮色和暗色两者主题，会跟随系统模式自动切换亮暗主题。 <code>This is a single line code style</code>
        </p>
        <p>
          <strong>Attention:</strong> The MDMDT.CSS file contains both light and dark themes, which will automatically switch between light
          and dark themes according to the system mode.
        </p>
      </blockquote>
      <h1>文本</h1>
      <p>
        这是一段正文内容样式，以下是不同文本样式效果：<strong>这是加粗文本样式</strong>, <u>这是下划线样式</u>, <em>这是斜体字样式</em>,
        <a href="https://github.com/cayxc/mdmdt">这是超链接样式: https://github.com/cayxc/mdmdt</a>,
        <code>This is a single line code style</code>, <del>这是删除线效果样式</del>, ==这是文字高亮效果==，上下标样式: $\LaTeX$, X^2^,
        H<del>2</del>O, <span style="background: var(--color-2-0-c)"> 这是鼠标选中效果&nbsp;</span>, 键盘键样式：<kbd>Command+Q</kbd> 🐳 😀
        🇨🇳
      </p>
      <p>
        This is a text content style and the following are the effects of different text styles: <strong>This is a bold text style</strong>,
        <a href="https://github.com/cayxc/mdmdt">This is a hyperlink style: https://github.com/cayxc/mdmdt</a>,
        <em>This is the italic font style</em>, <del>This is the strikethrough effect style</del>, <u>This is the underline style</u>,
        <code>This is a single line code style</code>, keyboard key style: <kbd>Command+Q</kbd>, $\LaTeX$ X^2^H<del>2</del>O, ==This is the
        text highlighting effect==, <span style="background: var(--color-2-0-c)">This is the mouse selection effect</span> 🐳 😀 🇨🇳
      </p>
      <!-- 这是注释内容......, This is the annotation content -->
      <h1>数学公式</h1>
      <p>
        直接使用公式： $$ \begin{aligned} I &amp;=\int_0^{ct}\frac{r}{\sqrt{c^2t^2 -r^2}}\int_0^{2\pi} m^2(m+n) d\theta
        dr&amp;=\int_0^{ct}\frac{r}{\sqrt{c^2t^2 -r^2}}\end{aligned} $$ $$ 代入公式得到： $$ $$u(t,x,y) = (3x+y) c^2 t^2 + x^2(x+y)$$
      </p>
      <p>$$ u(t,x,y) = \frac{1}{2\pi c} \frac{\part}{\part t} \iint\limits_{r&lt;ct} \frac{m^2(m+n)}{\sqrt{c^2t^2 -r^2 }}dmdn $$</p>
      <h1>列表</h1>
      <p>这些是列表样式效果:</p>
      <ol>
        <li>这是有序列表 A</li>
        <li>这是有序列表 B</li>
      </ol>
      <ul class="contains-task-list">
        <li>This is Item 1.</li>
        <li>This is Item 2.</li>
        <li class="task-list-item"><input type="checkbox" checked disabled /> Something is Not TODO.</li>
        <li class="task-list-item"><input type="checkbox" disabled /> Something is DONE.</li>
      </ul>
      <hr />
      <ol>
        <li>这是有序列表 A</li>
        <li>
          这是有序列表 B
          <ol>
            <li>这是有序列表 A</li>
            <li>这是有序列表 B</li>
          </ol>
        </li>
      </ol>
      <ul>
        <li>This is Item 1.</li>
        <li>
          This is Item 2.
          <ul>
            <li>This is Item 1.</li>
            <li>This is Item 2.</li>
          </ul>
        </li>
      </ul>
      <hr />
      <p>这是嵌套列表样式：</p>
      <ol>
        <li>这是有序列表 A</li>
        <li>
          这是有序列表 B
          <ul>
            <li>This is Item 1.</li>
            <li>
              This is Item 2.
              <ul class="contains-task-list">
                <li class="task-list-item"><input type="checkbox" checked disabled /> Something is Not TODO.</li>
                <li class="task-list-item"><input type="checkbox" disabled /> Something is DONE.</li>
              </ul>
            </li>
          </ul>
        </li>
      </ol>
      <ul>
        <li>这是有序列表 A</li>
        <li>
          这是有序列表 B
          <ol>
            <li>This is Item 1.</li>
            <li>
              This is Item 2.
              <ul class="contains-task-list">
                <li class="task-list-item"><input type="checkbox" disabled /> Something is Not TODO.</li>
                <li class="task-list-item"><input type="checkbox" checked disabled /> Something is DONE.</li>
              </ul>
            </li>
          </ol>
        </li>
      </ul>
      <h1>代码</h1>
      <p>单行代码样式：<code>composer require --dev barryvdh/laravel-ide-helper</code></p>
      <p>大段代码块样式：</p>
      <pre
        class="language-javascript"
      ><code class="language-javascript code-highlight"><span class="code-line line-number" line="1"><span class="token doc-comment comment">/**
</span></span><span class="code-line line-number" line="2"><span class="token doc-comment comment">  * ----------------------------------------
</span></span><span class="code-line line-number" line="3"><span class="token doc-comment comment">  * 设置递增的 level 编号
</span></span><span class="code-line line-number" line="4"><span class="token doc-comment comment">  * ----------------------------------------
</span></span><span class="code-line line-number" line="5"><span class="token doc-comment comment">  * <span class="token keyword">@param</span> <span class="token parameter">tag</span> obj 标签对象
</span></span><span class="code-line line-number" line="6"><span class="token doc-comment comment">  */</span>
</span><span class="code-line line-number" line="7"><span class="token function">setLevelNumber</span><span class="token punctuation">(</span><span class="token parameter">tag</span><span class="token punctuation">)</span><span class="token punctuation">{</span>
</span><span class="code-line line-number" line="8">   <span class="token keyword control-flow">try</span> <span class="token punctuation">{</span>
</span><span class="code-line line-number" line="9">     <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token keyword">typeof</span> tag<span class="token punctuation">)</span> <span class="token operator">!=</span> <span class="token string">'object'</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
</span><span class="code-line line-number" line="10">       <span class="token keyword control-flow">throw</span> <span class="token string">'setLevelNumber() 调用时参数类型错误，必须是一个h标签的对象集合！'</span><span class="token punctuation">;</span>
</span><span class="code-line line-number" line="11">     <span class="token punctuation">}</span>
</span><span class="code-line line-number" line="12">     <span class="token keyword">let</span> str <span class="token operator">=</span> tag<span class="token punctuation">.</span><span class="token property-access">id</span><span class="token punctuation">;</span>
</span><span class="code-line line-number" line="13">     <span class="token keyword control-flow">if</span> <span class="token punctuation">(</span>str<span class="token punctuation">.</span><span class="token method function property-access">lastIndexOf</span><span class="token punctuation">(</span><span class="token string">'.'</span><span class="token punctuation">)</span> <span class="token operator">==</span> <span class="token operator">-</span><span class="token number">1</span><span class="token punctuation">)</span> <span class="token punctuation">{</span> <span class="token comment">//如果是一级目录形式 level-1000</span>
</span><span class="code-line line-number" line="14">       <span class="token keyword">let</span> newValue <span class="token operator">=</span> <span class="token function">parseInt</span><span class="token punctuation">(</span>str<span class="token punctuation">.</span><span class="token method function property-access">slice</span><span class="token punctuation">(</span><span class="token number">6</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token operator">+</span> <span class="token number">1</span><span class="token punctuation">;</span>
</span><span class="code-line line-number" line="15">       <span class="token keyword control-flow">return</span> <span class="token string">'level-'</span> <span class="token operator">+</span> newValue<span class="token punctuation">;</span>
</span><span class="code-line line-number" line="16">     <span class="token punctuation">}</span>
</span><span class="code-line line-number" line="17">   <span class="token punctuation">}</span> <span class="token keyword control-flow">catch</span> <span class="token punctuation">(</span>err<span class="token punctuation">)</span> <span class="token punctuation">{</span>
</span><span class="code-line line-number" line="18">     <span class="token keyword control-flow">return</span> err<span class="token punctuation">;</span>
</span><span class="code-line line-number" line="19">   <span class="token punctuation">}</span>
</span><span class="code-line line-number" line="20"><span class="token punctuation">}</span>
</span></code></pre>

      <h1>表格样式</h1>

      <table>
        <thead>
          <tr>
            <th align="left">Left-Aligned</th>
            <th align="center">Center Aligned</th>
            <th align="right">Right Aligned</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td align="left">This is the first line</td>
            <td align="center"><code>this is code</code> some wordy text and some code</td>
            <td align="right">$160</td>
          </tr>
          <tr>
            <td align="left">This is the second line</td>
            <td align="center">some code: <code>this is code</code> centered</td>
            <td align="right">$1200.99</td>
          </tr>
          <tr>
            <td align="left">This is the third line</td>
            <td align="center">These are some texts</td>
            <td align="right">$125.5</td>
          </tr>
        </tbody>
      </table>
      <h1>引用文本框</h1>
      <blockquote>
        <p>[!NOTE]</p>
        <p>This is a Note text box ...... <code>this is code style</code></p>
        <blockquote>
          <p>This is a Note text box ......</p>
        </blockquote>
      </blockquote>
      <blockquote>
        <p>[!TIP]</p>
        <p>This is a Tip text box ......</p>
      </blockquote>
      <blockquote>
        <p>[!IMPORTANT]</p>
        <p>This is a Important text box ......</p>
      </blockquote>
      <blockquote>
        <p>[!WARNING]</p>
        <p>This is a Warning text box ......</p>
      </blockquote>
      <blockquote>
        <p>[!CAUTION]</p>
        <p>This is a Caution text box ......</p>
      </blockquote>
      <h1>图片</h1>
      <p><img src="./img/mdmdt.png" alt="" /></p>
      <h1>图表Mermaid</h1>
      <p>以下是 <strong>Mermaid图表</strong> 部分示例，更多图表类型请参考：<a href="https://mermaid.js.org">Mermaid图表</a></p>
      <pre
        class="language-mermaid"
      ><code class="language-mermaid code-highlight"><span class="code-line line-number" line="1"><span class="token keyword">flowchart</span> LR
</span><span class="code-line line-number" line="2">    A<span class="token text string">[Hard edge]</span> <span class="token arrow operator">--&gt;</span><span class="token label property">|Link text|</span> B<span class="token text string">(Round edge)</span>
</span><span class="code-line line-number" line="3">    B <span class="token arrow operator">--&gt;</span> C<span class="token text string">{Decision}</span>
</span><span class="code-line line-number" line="4">    C <span class="token arrow operator">--&gt;</span><span class="token label property">|One|</span> D<span class="token text string">[Result one]</span>
</span><span class="code-line line-number" line="5">    C <span class="token arrow operator">--&gt;</span><span class="token label property">|Two|</span> E<span class="token text string">[Result two]</span>
</span></code></pre>
      <pre
        class="language-mermaid"
      ><code class="language-mermaid code-highlight"><span class="code-line line-number" line="1"><span class="token keyword">stateDiagram-v2</span>
</span><span class="code-line line-number" line="2">    <span class="token text string">[*]</span> <span class="token arrow operator">--&gt;</span> Active
</span><span class="code-line line-number" line="3">
</span><span class="code-line line-number" line="4">    <span class="token keyword">state</span> Active <span class="token punctuation">{</span>
</span><span class="code-line line-number" line="5">        <span class="token text string">[*]</span> <span class="token arrow operator">--&gt;</span> NumLockOff
</span><span class="code-line line-number" line="6">        NumLockOff <span class="token arrow operator">--&gt;</span> NumLockOn <span class="token operator">:</span> EvNumLockPressed
</span><span class="code-line line-number" line="7">        NumLockOn <span class="token arrow operator">--&gt;</span> NumLockOff <span class="token operator">:</span> EvNumLockPressed
</span><span class="code-line line-number" line="8">        <span class="token arrow operator">--</span>
</span><span class="code-line line-number" line="9">        <span class="token text string">[*]</span> <span class="token arrow operator">--&gt;</span> CapsLockOff
</span><span class="code-line line-number" line="10">        CapsLockOff <span class="token arrow operator">--&gt;</span> CapsLockOn <span class="token operator">:</span> EvCapsLockPressed
</span><span class="code-line line-number" line="11">        CapsLockOn <span class="token arrow operator">--&gt;</span> CapsLockOff <span class="token operator">:</span> EvCapsLockPressed
</span><span class="code-line line-number" line="12">        <span class="token arrow operator">--</span>
</span><span class="code-line line-number" line="13">        <span class="token text string">[*]</span> <span class="token arrow operator">--&gt;</span> ScrollLockOff
</span><span class="code-line line-number" line="14">        ScrollLockOff <span class="token arrow operator">--&gt;</span> ScrollLockOn <span class="token operator">:</span> EvScrollLockPressed
</span><span class="code-line line-number" line="15">        ScrollLockOn <span class="token arrow operator">--&gt;</span> ScrollLockOff <span class="token operator">:</span> EvScrollLockPressed
</span><span class="code-line line-number" line="16">    <span class="token punctuation">}</span>
</span></code></pre>
      <pre
        class="language-mermaid"
      ><code class="language-mermaid code-highlight"><span class="code-line line-number" line="1"><span class="token keyword">gantt</span>
</span><span class="code-line line-number" line="2">    dateFormat  YYYY-MM-DD
</span><span class="code-line line-number" line="3">    title       Adding GANTT diagram functionality to mermaid
</span><span class="code-line line-number" line="4">    excludes    weekends
</span><span class="code-line line-number" line="5">    <span class="token comment">%% (`excludes` accepts specific dates in YYYY-MM-DD format, days of the week ("sunday") or "weekends", but not the word "weekdays".)</span>
</span><span class="code-line line-number" line="6">
</span><span class="code-line line-number" line="7">    section A section
</span><span class="code-line line-number" line="8">    Completed task            <span class="token operator">:</span>done,    des1, 2014-01-06,2014-01-08
</span><span class="code-line line-number" line="9">    Active task               <span class="token operator">:</span>active,  des2, 2014-01-09, 3d
</span><span class="code-line line-number" line="10">    Future task               <span class="token operator">:</span>         des3, after des2, 5d
</span><span class="code-line line-number" line="11">    Future task2              <span class="token operator">:</span>         des4, after des3, 5d
</span><span class="code-line line-number" line="12">
</span><span class="code-line line-number" line="13">    section Critical tasks
</span><span class="code-line line-number" line="14">    Completed task in the critical line <span class="token operator">:</span>crit, done, 2014-01-06,24h
</span><span class="code-line line-number" line="15">    Implement parser and jison          <span class="token operator">:</span>crit, done, after des1, 2d
</span><span class="code-line line-number" line="16">    Create tests for parser             <span class="token operator">:</span>crit, active, 3d
</span><span class="code-line line-number" line="17">    Future task in critical line        <span class="token operator">:</span>crit, 5d
</span><span class="code-line line-number" line="18">    Create tests for renderer           <span class="token operator">:</span>2d
</span><span class="code-line line-number" line="19">    Add to mermaid                      <span class="token operator">:</span>until isadded
</span><span class="code-line line-number" line="20">    Functionality added                 <span class="token operator">:</span>milestone, isadded, 2014-01-25, 0d
</span><span class="code-line line-number" line="21">
</span><span class="code-line line-number" line="22">    section Documentation
</span><span class="code-line line-number" line="23">    Describe gantt syntax               <span class="token operator">:</span>active, a1, after des1, 3d
</span><span class="code-line line-number" line="24">    Add gantt diagram to demo page      <span class="token operator">:</span>after a1  , 20h
</span><span class="code-line line-number" line="25">    Add another diagram to demo page    <span class="token operator">:</span>doc1, after a1  , 48h
</span><span class="code-line line-number" line="26">
</span><span class="code-line line-number" line="27">    section Last section
</span><span class="code-line line-number" line="28">    Describe gantt syntax               <span class="token operator">:</span>after doc1, 3d
</span><span class="code-line line-number" line="29">    Add gantt diagram to demo page      <span class="token operator">:</span>20h
</span><span class="code-line line-number" line="30">    Add another diagram to demo page    <span class="token operator">:</span>48h
</span></code></pre>
      <h2>Flowchart</h2>
      <h2>Sequence Diagram</h2>
      <h2>State Diagram</h2>
      <h1>一级标题1</h1>
      <h2>二级标题2</h2>
      <h3>三级标题3</h3>
      <h4>四级标题4</h4>
      <h5>五级标题5</h5>
      <h6>六级标题6</h6>
      <h1>TOC目录</h1>
      <p>以下是 [TOC] 目录样式</p>
      <p>[TOC]</p>
    </div>
  </div>
</template>
